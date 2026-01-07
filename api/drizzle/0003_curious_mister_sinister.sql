UPDATE flows SET trigger_type = 'manual' WHERE trigger_type = 'http';--> statement-breakpoint
UPDATE executions SET triggered_by = 'manual' WHERE triggered_by = 'http';--> statement-breakpoint
ALTER TABLE "executions" ALTER COLUMN "triggered_by" SET DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "flows" ALTER COLUMN "trigger_type" SET DEFAULT 'manual';