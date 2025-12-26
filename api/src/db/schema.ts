import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import type { IFlow, IContext } from '@streamly/shared';

export const flows = pgTable('flows', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  data: jsonb('data').$type<IFlow>().notNull(),
  triggerType: text('trigger_type').notNull().default('http'),
  cronExpression: text('cron_expression'),
  enabled: boolean('enabled').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const executions = pgTable('executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  flowId: uuid('flow_id').references(() => flows.id, { onDelete: 'cascade' }),
  context: jsonb('context').$type<IContext>().notNull(),
  status: text('status').notNull(),
  triggeredBy: text('triggered_by').notNull().default('http'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
