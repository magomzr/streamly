# Streamly

Streamly is a workflow automation engine inspired by tools like Zapier, Activepieces, and n8n, built with NestJS and TypeScript. It provides a clean, minimal, and extensible architecture for executing sequential workflows with context propagation and modular step design.

## Motivation

Modern automation platforms share common architectural patterns:

1. A flow engine (runtime/executor)
2. Flow definitions (JSON-based configuration)
3. Reusable steps/actions/connectors
4. Context object that travels through the pipeline
5. Error handling and observability
6. Execution modes (sync, queued, event-driven)

Streamly implements these patterns with a focus on simplicity, type safety, and extensibility.

---

## Core Concepts

### Flow Definition

A flow is a JSON structure containing ordered steps:

```json
{
  "name": "Sample Flow",
  "steps": [
    {
      "id": "step-1",
      "name": "fetchTodo",
      "type": "http_request",
      "settings": { "url": "https://api.example.com/todos/1" }
    },
    {
      "id": "step-2",
      "name": "notifyUser",
      "type": "send_sms",
      "settings": { "message": "Todo: {{steps.fetchTodo.title}}" }
    }
  ]
}
```

### Context Propagation

The execution context travels through all steps:

```typescript
interface IContext {
  id: string;
  name: string;
  vars: Record<string, any>;      // Initial input variables
  steps: Record<string, any>;     // Output from each step by name
  logs: string[];                 // Execution logs
}
```

- `vars`: Global variables passed at flow initialization
- `steps`: Outputs from executed steps, accessible by step name
- `logs`: Timestamped execution logs

### Step Implementation

Steps are injectable NestJS services implementing `IStepExecutor`:

```typescript
@Injectable()
export class HttpClientStep implements IStepExecutor {
  static stepType = 'http_request';

  async run(ctx: IContext, settings: any): Promise<any> {
    const { url, method = 'GET' } = settings;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}
```

---

## Architecture

```
/src
  /engine
    engine.service.ts       # Facade for flow execution
    engine.ts               # Core engine orchestrator
    executor.ts             # Sequential step executor
  /registry
    stepRegistry.ts         # Step type registry
  /steps
    /http-client
      http-client.service.ts
    /send-sms
      send-sms.service.ts
  /types
    core.ts                 # Core interfaces
    engine.ts               # Engine interfaces
    registry.ts             # Registry interfaces
  /modules
    engine.module.ts        # Engine module
    steps.module.ts         # Steps module with auto-registration
  /utils
    logger.ts               # Logging utilities
```

### Key Components

**Engine Service**: Facade that coordinates flow execution through dependency injection.

**Executor**: Iterates through flow steps, instantiates step executors, manages context, and collects outputs.

**Step Registry**: Injectable registry that maps step types to their constructors. Steps are auto-registered on module initialization.

**Step Executors**: Injectable services that implement business logic. Each step receives context and settings, returns output.

---

## Type System

### Step Definition vs Step Executor

```typescript
// Configuration from UI/API
interface IStepDefinition {
  id: string;
  name?: string;
  type: string;
  settings?: Record<string, any>;
}

// Implementation class
interface IStepExecutor {
  run(ctx: IContext, settings: any): Promise<any>;
}
```

This separation ensures clear boundaries between configuration and execution.

---

## Usage

### Running a Flow

```typescript
const flow = {
  name: 'Sample Flow',
  steps: [
    {
      id: 'step-1',
      name: 'fetchTodo',
      type: 'http_request',
      settings: { url: 'https://jsonplaceholder.typicode.com/todos/1' }
    },
    {
      id: 'step-2',
      name: 'sendNotification',
      type: 'send_sms',
      settings: { message: 'Title: {{steps.fetchTodo.title}}' }
    }
  ]
};

const result = await engineService.runFlow(flow, { phoneNumber: '+1234567890' });

console.log(result.steps.fetchTodo);        // HTTP response
console.log(result.steps.sendNotification); // SMS result
console.log(result.logs);                   // Execution logs
```

### Creating a New Step

1. Create a new service implementing `IStepExecutor`:

```typescript
@Injectable()
export class MyCustomStep implements IStepExecutor {
  static stepType = 'my_custom_step';

  async run(ctx: IContext, settings: any): Promise<any> {
    // Access input variables
    const value = ctx.vars.someVariable;
    
    // Access previous step outputs
    const previousData = ctx.steps.previousStepName;
    
    // Add logs
    ctx.logs.push(createStepLog('INFO', 'MyCustomStep', 'Processing...'));
    
    // Return output
    return { result: 'success' };
  }
}
```

2. Register in `StepsModule`:

```typescript
@Module({
  providers: [MyCustomStep, ...],
  exports: [MyCustomStep, ...],
})
export class StepsModule implements OnModuleInit {
  onModuleInit() {
    this.engineService.registerStep(MyCustomStep);
  }
}
```

---

## Features

### Implemented

- Sequential step execution
- Context propagation with vars and step outputs
- Step registry with dependency injection
- Auto-registration of steps on module init
- Structured logging with timestamps
- Type-safe interfaces
- NestJS integration with full DI support

### Roadmap

- Error handling and retry logic
- Conditional branching
- Parallel execution
- Trigger-driven flows
- Workflow versioning and persistence
- RxJS-based reactive execution
- Queue-based execution (Bull/BullMQ)
- Visual flow builder (Angular)
- Step marketplace

---

## Development

### Installation

```bash
npm install
```

### Running

```bash
npm run start:dev
```

### Testing

```bash
npm run test
```

---

## Design Principles

- **Simplicity**: Minimal abstractions, clear separation of concerns
- **Type Safety**: Full TypeScript coverage with explicit interfaces
- **Extensibility**: Easy to add new steps without modifying core engine
- **Testability**: Dependency injection enables easy mocking and testing
- **Scalability**: Architecture supports future enhancements (queues, parallel execution, etc.)

---

## License

MIT
