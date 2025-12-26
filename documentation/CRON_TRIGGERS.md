# Cron Triggers - Scheduled Flow Execution

Streamly now supports automatic flow execution based on cron expressions, in addition to traditional manual execution.

## Features

- HTTP (manual) and Cron (scheduled) triggers
- Standard cron expressions (Unix format)
- Common presets (every 5 min, hourly, daily, etc.)
- Enable/disable schedules without losing configuration
- Visual indicators in UI for scheduled flows
- Auto-load schedules on server startup
- Execution logs with origin (http/cron)

## UI Usage

### Configure Trigger

1. Open or create a flow
2. In the top-right corner you'll see the "Trigger Configuration" panel
3. Select between:
   - **HTTP Request**: Manual execution (default)
   - **Scheduled (Cron)**: Automatic execution

### Configure Cron

1. Select "Scheduled (Cron)"
2. Enter cron expression or use "Presets" for common options
3. Check "Enable scheduled execution"
4. Save the flow

### Visual Indicators

- Flows with cron trigger show ⏰ in the sidebar
- Green (⏰) = Active and scheduled
- Gray (⏰) = Configured but disabled

## Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, 0 and 7 = Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

### Examples

| Expression    | Description                         |
| ------------- | ----------------------------------- |
| `* * * * *`   | Every minute                        |
| `*/5 * * * *` | Every 5 minutes                     |
| `0 * * * *`   | Every hour                          |
| `0 9 * * *`   | Daily at 9 AM                       |
| `0 9 * * 1`   | Every Monday at 9 AM                |
| `0 0 1 * *`   | First day of each month at midnight |

## API Endpoints

### Update Trigger

```bash
PATCH /flows/:id/trigger
Content-Type: application/json

{
  "type": "cron",
  "cronExpression": "*/5 * * * *",
  "enabled": true
}
```

### Enable Flow

```bash
POST /flows/:id/enable
```

### Disable Flow

```bash
POST /flows/:id/disable
```

### List Scheduled Flows

```bash
GET /flows/scheduled/list
```

## Database

New columns in `flows` table:

- `trigger_type`: 'http' | 'cron' (default: 'http')
- `cron_expression`: string | null
- `enabled`: boolean (default: false)

New column in `executions` table:

- `triggered_by`: 'http' | 'cron' (default: 'http')

## Architecture

### Backend

- **SchedulerService**: Manages registration and execution of cron jobs
  - Auto-loads scheduled flows on startup
  - Validates cron expressions
  - Executes flows on schedule
  - Updates schedules dynamically

- **FlowService**: Methods to handle trigger configuration
  - `updateTrigger()`: Update only trigger configuration
  - `findScheduled()`: Get flows with cron trigger

### Frontend

- **TriggerConfig**: Component to configure triggers
  - Toggle HTTP/Cron
  - Input with presets for cron expressions
  - Checkbox for enable/disable
  - Visual validation

- **FlowBuilder**: Trigger config integration
  - Persists trigger in flow data
  - Displays in top-right corner

- **Sidebar**: Visual indicators
  - ⏰ icon for flows with cron
  - Green color if active

## Considerations

### Timezone

All cron expressions run in UTC. To adjust to your local timezone, calculate the corresponding offset.

### Concurrency

If a cron triggers while the previous execution is still running, parallel execution is allowed. Consider adding queue logic if you need sequential executions.

### Persistence

Schedules are automatically loaded on server restart from the database.

### Validation

Cron expressions are validated before registering the schedule. Invalid expressions are rejected with error in logs.

## Testing

```bash
# Test backend
cd api
pnpm test scheduler.service.spec.ts

# Full test
pnpm test
```

## Complete Example

```typescript
// Flow with cron trigger
const flow: IFlow = {
  name: 'Daily Report',
  steps: [
    {
      id: 'step1',
      name: 'fetch_data',
      type: 'http_request',
      settings: { url: 'https://api.example.com/data' },
    },
    {
      id: 'step2',
      name: 'send_email',
      type: 'send_email',
      settings: { to: 'team@example.com' },
    },
  ],
  edges: [{ source: 'step1', target: 'step2' }],
  trigger: {
    type: 'cron',
    cronExpression: '0 9 * * *', // Daily at 9 AM
    enabled: true,
  },
};
```

## Troubleshooting

### Flow doesn't execute

1. Verify that `enabled: true`
2. Check server logs for validation errors
3. Confirm that the cron expression is valid
4. Verify that the server is running

### Invalid cron expression

Use online tools like [crontab.guru](https://crontab.guru) to validate expressions.

### Schedule doesn't update

Save the flow after changing the trigger configuration. Changes are applied immediately.
