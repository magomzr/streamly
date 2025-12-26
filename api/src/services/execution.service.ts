import { Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { executions } from '../db/schema';
import type { IContext } from '@streamly/shared';

@Injectable()
export class ExecutionService {
  async create(
    flowId: string,
    context: IContext,
    triggeredBy: string = 'http',
  ) {
    const [created] = await db
      .insert(executions)
      .values({ flowId, context, status: context.status, triggeredBy })
      .returning();
    return created;
  }

  async findByFlowId(flowId: string) {
    return db
      .select()
      .from(executions)
      .where(eq(executions.flowId, flowId))
      .orderBy(desc(executions.createdAt));
  }

  async findOne(id: string) {
    const [execution] = await db
      .select()
      .from(executions)
      .where(eq(executions.id, id));
    return execution;
  }
}
