# RxJS-Based Flow Engine (Early Draft)

This document describes an early prototype of Streamly that used RxJS for reactive flow execution. This approach was explored before settling on the current Promise-based sequential executor.

## Overview

The RxJS implementation leveraged reactive streams to execute workflow steps sequentially, using operators like `concatMap` and `switchMap` to chain step execution while maintaining context propagation.

## Core Concepts

### Flow Definition

A flow is an array of step objects with type and configuration:

```javascript
const flow = [
  { type: 'readVars' },
  { type: 'httpCall', url: 'https://api.example.com/data' },
  { type: 'notify', channel: 'sms' },
  { type: 'updateContext', key: 'status', value: 'done' },
];
```

### Handler Registry

Step handlers are registered in a map, where each handler receives the step definition and current context, returning an Observable:

```javascript
const handlers = {
  readVars: (step, ctx) => of({ ...ctx, vars: { initial: true } }),
  httpCall: (step, ctx) =>
    from(httpCall(step.url)).pipe(
      map((result) => ({ ...ctx, apiResult: result.data })),
    ),
  notify: (step, ctx) =>
    from(sendNotification(ctx.apiResult)).pipe(
      map((result) => ({ ...ctx, notification: result })),
    ),
  updateContext: (step, ctx) => of({ ...ctx, [step.key]: step.value }),
};
```

### Engine Execution

The engine uses RxJS operators to:

1. Convert the flow array into an Observable stream
2. Execute each step sequentially with `concatMap`
3. Switch to the handler's Observable with `switchMap`
4. Log execution with `tap`
5. Update the shared context after each step

```javascript
const executeFlow = (flow) => {
  return from(flow).pipe(
    concatMap((step) =>
      of(step).pipe(
        switchMap((s) => handlers[s.type](s, currentContext)),
        tap((newCtx) => console.log(`Step ${step.type} executed`, newCtx)),
        map((newCtx) => {
          currentContext = newCtx;
          return newCtx;
        }),
      ),
    ),
  );
};
```

## Key Features

- **Sequential Execution**: `concatMap` ensures steps run one after another
- **Context Propagation**: Context is passed through the stream and updated after each step
- **Reactive Streams**: Leverages RxJS for async operation handling
- **Handler Registry**: Decoupled step implementations

## Limitations

- **Mutable Context**: Relies on a shared `currentContext` variable that gets mutated
- **No Error Handling**: Missing retry logic and error recovery
- **No Metadata**: Steps don't track execution metadata
- **Complex Debugging**: RxJS streams can be harder to debug than Promise chains
- **Learning Curve**: Requires RxJS knowledge for maintenance

## Why We Moved Away

The current implementation uses a simpler Promise-based approach because:

1. **Simpler Mental Model**: Async/await is more intuitive than RxJS operators
2. **Better Error Handling**: Try-catch blocks and retry logic are easier to implement
3. **Immutable Context**: Context is passed explicitly rather than mutated globally
4. **Metadata Support**: Each step output includes execution metadata
5. **Lower Barrier**: No RxJS knowledge required for contributors

## Potential Future Use

RxJS could still be valuable for:

- **Parallel Execution**: Using `mergeMap` for concurrent steps
- **Event-Driven Flows**: Triggering flows from event streams
- **Backpressure Handling**: Managing high-throughput scenarios
- **Advanced Operators**: Debouncing, throttling, or combining multiple flows

This draft remains as reference for potential reactive execution modes in future versions.
