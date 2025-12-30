import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { secrets } from '../db/schema';
import * as crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

@Injectable()
export class SecretsService {
  private readonly encryptionKey: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key?.length !== 64) {
      throw new Error(
        'ENCRYPTION_KEY must be set and be 64 hex characters (32 bytes). Generate with: openssl rand -hex 32',
      );
    }
    this.encryptionKey = Buffer.from(key, 'hex');
  }

  private encrypt(value: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.encryptionKey, iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decrypt(encryptedValue: string): string {
    const parts = encryptedValue.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted value format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async create(name: string, value: string) {
    const encryptedValue = this.encrypt(value);
    const [secret] = await db
      .insert(secrets)
      .values({ name, encryptedValue })
      .returning();
    return { id: secret.id, name: secret.name, createdAt: secret.createdAt };
  }

  async findAll() {
    const allSecrets = await db.select().from(secrets);
    return allSecrets.map((s) => ({
      id: s.id,
      name: s.name,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  async findByName(name: string) {
    const [secret] = await db
      .select()
      .from(secrets)
      .where(eq(secrets.name, name));
    return secret;
  }

  async update(name: string, value: string) {
    const encryptedValue = this.encrypt(value);
    const [updated] = await db
      .update(secrets)
      .set({ encryptedValue, updatedAt: new Date() })
      .where(eq(secrets.name, name))
      .returning();

    if (!updated) {
      throw new Error(`Secret ${name} not found`);
    }

    return { id: updated.id, name: updated.name, updatedAt: updated.updatedAt };
  }

  async delete(name: string) {
    const [deleted] = await db
      .delete(secrets)
      .where(eq(secrets.name, name))
      .returning();

    if (!deleted) {
      throw new Error(`Secret ${name} not found`);
    }

    return { name: deleted.name };
  }

  async resolveSecrets(text: string): Promise<string> {
    const secretPattern = /\{\{secret\.([A-Z_][A-Z0-9_]*)\}\}/g;
    const matches = [...text.matchAll(secretPattern)];

    if (matches.length === 0) {
      return text;
    }

    let resolved = text;
    for (const match of matches) {
      const secretName = match[1];
      const secret = await this.findByName(secretName);

      if (!secret) {
        throw new Error(`Secret not found: ${secretName}`);
      }

      const decryptedValue = this.decrypt(secret.encryptedValue);
      resolved = resolved.replace(match[0], decryptedValue);
    }

    return resolved;
  }

  async resolveSecretsInObject(obj: any): Promise<any> {
    if (typeof obj === 'string') {
      return this.resolveSecrets(obj);
    }

    if (Array.isArray(obj)) {
      return Promise.all(obj.map((item) => this.resolveSecretsInObject(item)));
    }

    if (obj && typeof obj === 'object') {
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = await this.resolveSecretsInObject(value);
      }
      return resolved;
    }

    return obj;
  }
}
