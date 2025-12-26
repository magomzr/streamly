ALTER TABLE "executions" ADD COLUMN "triggered_by" text DEFAULT 'http' NOT NULL;--> statement-breakpoint
ALTER TABLE "flows" ADD COLUMN "trigger_type" text DEFAULT 'http' NOT NULL;--> statement-breakpoint
ALTER TABLE "flows" ADD COLUMN "cron_expression" text;--> statement-breakpoint
ALTER TABLE "flows" ADD COLUMN "enabled" boolean DEFAULT false NOT NULL;