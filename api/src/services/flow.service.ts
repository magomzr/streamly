import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { flows } from '../db/schema';
import type { IFlow } from '@streamly/shared';

@Injectable()
export class FlowService {
  async create(flow: IFlow) {
    const trigger = flow.trigger || { type: 'http', enabled: false };
    const [created] = await db
      .insert(flows)
      .values({
        name: flow.name,
        data: flow,
        triggerType: trigger.type,
        cronExpression: trigger.cronExpression,
        enabled: trigger.enabled || false,
      })
      .returning();
    return created;
  }

  async findAll() {
    return db.select().from(flows);
  }

  async findScheduled() {
    return db.select().from(flows).where(eq(flows.triggerType, 'cron'));
  }

  async findOne(id: string) {
    const [flow] = await db.select().from(flows).where(eq(flows.id, id));
    return flow;
  }

  async update(id: string, flow: IFlow) {
    const trigger = flow.trigger || { type: 'http', enabled: false };
    const [updated] = await db
      .update(flows)
      .set({
        name: flow.name,
        data: flow,
        triggerType: trigger.type,
        cronExpression: trigger.cronExpression,
        enabled: trigger.enabled || false,
        updatedAt: new Date(),
      })
      .where(eq(flows.id, id))
      .returning();
    return updated;
  }

  async updateTrigger(
    id: string,
    triggerType: string,
    cronExpression?: string,
    enabled?: boolean,
  ) {
    const [updated] = await db
      .update(flows)
      .set({
        triggerType,
        cronExpression,
        enabled: enabled ?? false,
        updatedAt: new Date(),
      })
      .where(eq(flows.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    await db.delete(flows).where(eq(flows.id, id));
  }
}
