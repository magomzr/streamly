# Streamly

Streamly is a **workflow automation engine** inspired by tools like
**Zapier**, **Activepieces**, and **n8n**, but designed from scratch
with a clean, minimal, and extensible architecture. It aims to serve as
a **learning-grade but production-ready** foundation for exploring
workflow execution, context propagation, modular connector design,
observable-based orchestration, and NestJS integration.

## Motivation

Modern automation platforms follow a predictable architecture:

1.  A **Flow Engine** (runtime / executor)
2.  A **Flow Definition** (JSON, DSL, UI-generated, etc.)
3.  A collection of reusable **steps / actions / connectors**
4.  A **context object** that travels through the pipeline
5.  Error handling, retries, observability
6.  Execution modes (sync, queued, event-driven)
7.  Future support for branching, parallel execution, and triggers

This repository starts simple but robust, building the foundation for a
scalable automation engine.

------------------------------------------------------------------------

## Core Concept

A **flow** is a list of ordered steps:

``` json
[
  { "name": "readVars" },
  { "name": "callApi" },
  { "name": "notify" },
  { "name": "updateVars" }
]
```

Each **step** is a small unit of logic:

``` js
{
  name: "stepName",
  run: async (ctx) => ({ ...updates })
}
```

The **FlowEngine** orchestrates sequential execution, merging the output
of each step into a shared `context`.

------------------------------------------------------------------------

## Architecture Overview

    /src
      /engine
        flow-engine.js
      /steps
        steps.js
      run.js

------------------------------------------------------------------------

## 🔧 Flow Engine (JS-first, RxJS-ready)

``` js
export class FlowEngine {
  constructor({ steps = [] } = {}) {
    this.steps = steps;
  }

  async run(initialContext = {}) {
    let ctx = { ...initialContext };

    for (const step of this.steps) {
      const { name, run } = step;
      console.log(`Executing step: ${name}`);

      try {
        const result = await run(ctx);
        ctx = { ...ctx, ...result };
      } catch (error) {
        console.error(`Error in "${name}":`, error.message);
        ctx.error = { step: name, message: error.message };
        break;
      }
    }

    console.log("Flow execution completed.");
    return ctx;
  }
}
```

------------------------------------------------------------------------

## Example Steps

``` js
import fetch from "node-fetch";

export const readVars = {
  name: "readVars",
  run: async (ctx) => {
    const { userId } = ctx;
    console.log(`Initial variables: userId=${userId}`);
    return { loadedAt: Date.now() };
  }
};

export const callApi = {
  name: "callApi",
  run: async () => {
    console.log("Performing HTTP request...");
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    return { apiResult: data };
  }
};

export const notify = {
  name: "notify",
  run: async (ctx) => {
    console.log(`Sending notification with: "${ctx.apiResult.title}"`);
    return { notificationSent: true };
  }
};

export const updateVars = {
  name: "updateVars",
  run: async () => ({
    lastUpdated: new Date().toISOString()
  })
};
```

------------------------------------------------------------------------

## Running a Flow

``` js
import { FlowEngine } from "./engine/flow-engine.js";
import { readVars, callApi, notify, updateVars } from "./steps/steps.js";

const engine = new FlowEngine({
  steps: [readVars, callApi, notify, updateVars]
});

const result = await engine.run({
  userId: "123",
  phone: "+57 300 000 0000",
  variables: {}
});

console.log("\nFinal Result:");
console.log(result);
```

------------------------------------------------------------------------

## Roadmap

-   RxJS-based FlowEngine
-   Step registry & connector marketplace
-   Trigger-driven flows
-   Branching & conditional logic
-   Parallel execution
-   Workflow versioning
-   Angular visual builder
-   NestJS integration with DI, modules, and queues
