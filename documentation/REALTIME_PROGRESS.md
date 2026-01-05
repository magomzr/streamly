# Real-time Execution Progress

Streamly now supports real-time execution progress indicators that show the status of each step as the flow executes.

## Features

- **Live Step Status**: See which steps are running, completed, or failed in real-time
- **Visual Indicators**: Color-coded nodes and animated icons show execution state
- **Server-Sent Events**: Uses SSE for efficient server-to-client streaming
- **No Breaking Changes**: Existing execution endpoint still works normally

## How It Works

### Backend (API)

The execution engine emits progress events as steps execute:

- `step_start`: When a step begins execution
- `step_complete`: When a step finishes successfully
- `step_error`: When a step fails
- `flow_complete`: When the entire flow completes
- `flow_error`: When the flow fails

These events are streamed to the client via Server-Sent Events (SSE).

### Frontend (Web)

The UI subscribes to progress events and updates node visual states:

- **Pending**: Default gray color
- **Running**: Blue border with pulsing indicator (⟳)
- **Completed**: Green border with checkmark (✓)
- **Error**: Red border with X mark (✕)

## API Endpoints

### Execute with Progress (SSE)

```
POST /flows/:id/execute/stream
```

**Request Body:**

```json
{
  "vars": {
    "key": "value"
  }
}
```

**Response:** Server-Sent Events stream

**Event Format:**

```
data: {"type":"step_start","stepId":"abc123","stepName":"http_request","stepType":"http_request","timestamp":"2024-01-01T00:00:00.000Z"}

data: {"type":"step_complete","stepId":"abc123","stepName":"http_request","stepType":"http_request","timestamp":"2024-01-01T00:00:01.000Z","data":{...}}

data: {"type":"complete","context":{...}}
```

### Execute without Progress (Standard)

```
POST /flows/:id/execute
```

The original endpoint still works and returns the full context after completion.

## Usage

### From the UI

Simply click "▶ Run Flow" - the UI automatically uses the streaming endpoint and shows real-time progress.

### From Code

```typescript
import { apiService } from './services/api';

// With progress tracking
await apiService.executeFlowByIdStream(flowId, { myVar: 'value' }, (event) => {
  if (event.type === 'step_start') {
    console.log(`Step ${event.stepName} started`);
  } else if (event.type === 'step_complete') {
    console.log(`Step ${event.stepName} completed`);
  } else if (event.type === 'complete') {
    console.log('Flow completed:', event.context);
  }
});

// Without progress (original method)
const result = await apiService.executeFlowById(flowId, { myVar: 'value' });
```

## Implementation Details

### Engine Service

The `EngineService` exposes a `progress$` observable (RxJS Subject) that emits events during execution:

```typescript
const progressSub = engineService.getProgressObservable().subscribe((event) => {
  // Handle progress event
});
```

### Executor

The `Executor` class emits events at key points:

- Before step execution
- After step completion
- On step error
- On flow completion/error

### State Management

The frontend uses Zustand store to track step progress:

```typescript
interface StepProgress {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  timestamp?: Date;
}
```

## Benefits

1. **Better UX**: Users see immediate feedback as flows execute
2. **Debugging**: Quickly identify which step is slow or failing
3. **Transparency**: Clear visibility into execution flow
4. **Non-intrusive**: Doesn't break existing functionality

## Future Enhancements

- Step execution time tracking
- Progress percentage for long-running steps
- Pause/resume execution
- Step-by-step debugging mode
