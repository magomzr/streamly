import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { flows } from '../db/schema';
import type { IFlow } from '@streamly/shared';

@Injectable()
export class FlowService {
  async create(flow: IFlow) {
    const [created] = await db
      .insert(flows)
      .values({ name: flow.name, data: flow })
      .returning();
    return created;
  }

  async findAll() {
    return db.select().from(flows);
  }

  async findOne(id: string) {
    const [flow] = await db.select().from(flows).where(eq(flows.id, id));
    return flow;
  }

  async update(id: string, flow: IFlow) {
    const [updated] = await db
      .update(flows)
      .set({ name: flow.name, data: flow, updatedAt: new Date() })
      .where(eq(flows.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(flows).where(eq(flows.id, id));
  }
}
