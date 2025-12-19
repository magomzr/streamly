## Overview

Ideal version for your starting point:
- Pure, clean, idiomatic JS.
- Extremely easy to migrate to RxJS, because each step is a pure unit and each execution returns an observable-friendly structure.
- No reliance on anything unusual, just clear design.
- Robust, predictable, and extensible.

This is Streamly's mini base engine.

## Objectives

Building a mini flow engine:

1. Receive a flow (ordered list of steps)
2. Receive a mutable context
3. Execute each step
4. Handle errors
5. Return a final context

Each step is an async function `(ctx) => newCtx`.

You can migrate to RxJS with a simple `from(flow.steps)` without rewriting steps.

## General Architecture

Imagine this divided into four components:

### Flow Designer (Angular)

Here, the user builds the flow visually:

Drag & drop “triggers” and “actions”

Configure credentials

Connect nodes such as: Trigger → Step → Step → Output

Save the definition as JSON

Example definition:

```json
{
  "trigger": {
    "type": "http_request",
    "config": { "method": "POST", "path": "/events/order-created" }
  },
  "steps": [
    {
      "id": "1",
      "type": "filter",
      "config": { "expression": "payload.total > 50" }
    },
    {
      "id": "2",
      "type": "send_email",
      "config": { "template": "big-order", "to": "{{payload.customer.email}}" }
    }
  ]
}
```

### Flow Engine (NestJS)

The backend has key modules:

FlowsModule: Basic CRUD for flows, but importantly: structured into submodules.
- definitions
- versions
- runs
- logs

TriggersModule: Registers and exposes triggers.
It can offer:
- Webhooks
- Internal event listeners
- Polling

StepsModule: Maintains a catalog of available steps.

ConnectorsModule
Handles API keys, OAuth, authentication with external services.

Scheduler/QueueModule: Uses BullMQ to execute each step of a run.

### Worker (Nest + BullMQ)

Processes each step:

1. Reads step configuration and credentials
2. Executes
3. Passes the result to the next step
4. If it fails → log + retry or stop
5. Updates the run status

This will give you a very realistic experience.

### Plugins / Integrations

This is really valuable for practice.

The idea is that each integration is registered as a small package:

```
packages/
  google-sheets/
  github/
  slack/
  mailer/
```

Each one exports:

- Available triggers
- Available steps
- Type of authentication required

## Mini flow engine (version that scales and migrates perfectly)

```js
// flow-engine.js
export class FlowEngine {
  constructor({ steps = [] } = {}) {
    this.steps = steps;
  }

  async run(initialContext = {}) {
    let ctx = { ...initialContext };

    for (const step of this.steps) {
      const { name, run } = step;

      console.log(`🔹 Executing step: ${name}`);

      try {
        const result = await run(ctx);

        // steps ALWAYS return an object
        ctx = { ...ctx, ...result };
      } catch (error) {
        console.error(`❌ Error in “${name}”:`, error.message);

        // ctx.error for debugging / fallback flows
        ctx.error = { step: name, message: error.message };
        break;
      }
    }

    console.log(“✅ Execution complete.”);
    return ctx;
  }
}
```

## Key features

Each step has the following format:
``` js
{ name: “name”, run: async (ctx) => ({ ...updates }) }
```

The engine only iterates steps → perfect for RxJS.

To migrate:

``` js
from(engine.steps).pipe(concatMap(step => step.run(ctx)))
```

You don't rewrite anything.

## Definition of steps (same as in the initial example)

``` js
// steps.js
import fetch from “node-fetch”;

// Step 1: Read variables
export const readVars = {
  name: “readVars”,
  run: async (ctx) => {
    const { userId } = ctx;
    console.log(`📥 Initial variables: userId=${userId}`);

    return {
      loadedAt: Date.now()
    };
  }
};

// Step 2: Llamada HTTP
export const callApi = {
  name: "callApi",
  run: async () => {
    console.log("🌐 Fetching...");

    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();

    return { apiResult: data };
  }
};

// Step 3: Notifications
export const notify = {
  name: “notify”,
  run: async (ctx) => {
    console.log(`📤 Notifying with title: “${ctx.apiResult.title}”`);
    
    // SMS-email service simulation
    // smsService.send(ctx.phone, ctx.apiResult.title)
    
    return { notificationSent: true };
  }
};

// Step 4: Update vars
export const updateVars = {
  name: “updateVars”,
  run: async () => {
    console.log(“🔧 Updating internal status...”);
    return {
      lastUpdated: new Date().toISOString()
    };
  }
};
```

## Flow execution

``` js
// run.js
import { FlowEngine } from "./flow-engine.js";
import { readVars, callApi, notify, updateVars } from "./steps.js";

const engine = new FlowEngine({
  steps: [readVars, callApi, notify, updateVars]
});

const result = await engine.run({
  userId: "123",
  phone: "+57 300 000 0000",
  variables: {}
});

console.log("\n📌 Result:");
console.log(result);
```

## WHY THIS IS THE RIGHT VERSION TO START WITH

1. Easy to understand, minimal, elegant

- No frameworks
- No dependencies
- No unnecessary patterns

2. Perfectly migrable to RxJS

The steps are independent functions → the engine is replaced by:
``` js
from(steps).pipe(
  concatMap(step => step.run(ctx)),
  scan((acc, result) => ({ ...acc, ...result }), initialContext)
)
```

With that, you now have:
- granular control
- parallelization
- cancellation
- backpressure
- retries
- timeouts

Without rewriting a single step.

3. Immediately compatible with NestJS

Transform this into a service:
``` js
@Injectable()
export class FlowEngineService extends FlowEngine {}
```
4. Scalable

- Each step can be a worker
- You can persist states
- You can version steps
- You can execute steps in parallel