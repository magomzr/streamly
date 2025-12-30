import { SecretsService } from '../../src/services/secrets.service';

describe('SecretsService - Encryption Logic', () => {
  let service: SecretsService;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = 'a'.repeat(64);
    service = new SecretsService();
  });

  afterEach(() => {
    delete process.env.ENCRYPTION_KEY;
  });

  describe('constructor', () => {
    it('should throw error if ENCRYPTION_KEY is not set', () => {
      delete process.env.ENCRYPTION_KEY;
      expect(() => new SecretsService()).toThrow(
        'ENCRYPTION_KEY must be set and be 64 hex characters',
      );
    });

    it('should throw error if ENCRYPTION_KEY is invalid length', () => {
      process.env.ENCRYPTION_KEY = 'short';
      expect(() => new SecretsService()).toThrow(
        'ENCRYPTION_KEY must be set and be 64 hex characters',
      );
    });

    it('should initialize with valid ENCRYPTION_KEY', () => {
      process.env.ENCRYPTION_KEY = 'a'.repeat(64);
      expect(() => new SecretsService()).not.toThrow();
    });
  });

  describe('encryption/decryption', () => {
    it('should encrypt a value', () => {
      const value = 'my-secret-password';
      const encrypted = (service as any).encrypt(value);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(value);
      expect(encrypted).toMatch(/^[a-f0-9]+:[a-f0-9]+:[a-f0-9]+$/);
    });

    it('should decrypt an encrypted value', () => {
      const originalValue = 'my-secret-password';
      const encrypted = (service as any).encrypt(originalValue);
      const decrypted = (service as any).decrypt(encrypted);

      expect(decrypted).toBe(originalValue);
    });

    it('should produce different encrypted values for same input (different IVs)', () => {
      const value = 'same-value';
      const encrypted1 = (service as any).encrypt(value);
      const encrypted2 = (service as any).encrypt(value);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle special characters', () => {
      const value = 'p@ssw0rd!#$%^&*()';
      const encrypted = (service as any).encrypt(value);
      const decrypted = (service as any).decrypt(encrypted);

      expect(decrypted).toBe(value);
    });

    it('should handle unicode characters', () => {
      const value = 'contraseña-密码-🔐';
      const encrypted = (service as any).encrypt(value);
      const decrypted = (service as any).decrypt(encrypted);

      expect(decrypted).toBe(value);
    });

    it('should handle empty string', () => {
      const value = '';
      const encrypted = (service as any).encrypt(value);
      const decrypted = (service as any).decrypt(encrypted);

      expect(decrypted).toBe(value);
    });

    it('should handle long strings', () => {
      const value = 'a'.repeat(1000);
      const encrypted = (service as any).encrypt(value);
      const decrypted = (service as any).decrypt(encrypted);

      expect(decrypted).toBe(value);
    });

    it('should throw error for invalid encrypted format', () => {
      expect(() => {
        (service as any).decrypt('invalid-format');
      }).toThrow('Invalid encrypted value format');
    });

    it('should throw error for corrupted encrypted data', () => {
      const encrypted = (service as any).encrypt('test');
      const corrupted = encrypted.replaceAll('a', 'b');

      expect(() => {
        (service as any).decrypt(corrupted);
      }).toThrow();
    });
  });

  describe('resolveSecrets pattern matching', () => {
    it('should match valid secret patterns', () => {
      const pattern = /\{\{secret\.([A-Z_][A-Z0-9_]*)\}\}/g;

      expect('{{secret.API_KEY}}'.match(pattern)).toBeTruthy();
      expect('{{secret.MY_SECRET}}'.match(pattern)).toBeTruthy();
      expect('{{secret.SECRET_123}}'.match(pattern)).toBeTruthy();
      expect('{{secret._PRIVATE}}'.match(pattern)).toBeTruthy();
    });

    it('should not match invalid secret patterns', () => {
      const pattern = /\{\{secret\.([A-Z_][A-Z0-9_]*)\}\}/g;

      expect('{{secret.lowercase}}'.match(pattern)).toBeFalsy();
      expect('{{secret.123START}}'.match(pattern)).toBeFalsy();
      expect('{{secret.with-dash}}'.match(pattern)).toBeFalsy();
      expect('{{secret.with space}}'.match(pattern)).toBeFalsy();
    });
  });

  describe('resolveSecretsInObject - structure handling', () => {
    it('should handle string primitives', async () => {
      const result = await service.resolveSecretsInObject('plain text');
      expect(result).toBe('plain text');
    });

    it('should handle number primitives', async () => {
      const result = await service.resolveSecretsInObject(42);
      expect(result).toBe(42);
    });

    it('should handle boolean primitives', async () => {
      const result = await service.resolveSecretsInObject(true);
      expect(result).toBe(true);
    });

    it('should handle null', async () => {
      const result = await service.resolveSecretsInObject(null);
      expect(result).toBe(null);
    });

    it('should handle undefined', async () => {
      const result = await service.resolveSecretsInObject(undefined);
      expect(result).toBe(undefined);
    });

    it('should handle empty objects', async () => {
      const result = await service.resolveSecretsInObject({});
      expect(result).toEqual({});
    });

    it('should handle empty arrays', async () => {
      const result = await service.resolveSecretsInObject([]);
      expect(result).toEqual([]);
    });

    it('should preserve object structure', async () => {
      const obj = {
        a: 'value1',
        b: {
          c: 'value2',
          d: [1, 2, 3],
        },
      };

      const result = await service.resolveSecretsInObject(obj);
      expect(result).toEqual(obj);
    });
  });
});
