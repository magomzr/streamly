/*
 * Streamly - Simple Workflow Engine MVP
 *
 * This is a minimal workflow engine that:
 *
 * 1. Executes a sequence of predefined steps in order
 * 2. Supports different step types:
 *    - readVars: Reads variables from context
 *    - httpRequest: Makes HTTP requests
 *    - notify: Sends notifications
 *    - updateVars: Updates context variables
 *
 * 3. Maintains a context object that:
 *    - Persists data between steps
 *    - Can be read/updated by steps
 *
 * 4. Each step:
 *    - Receives the context and previous step output
 *    - Returns an output that can be used by next steps
 *    - Is registered in a central registry for lookup
 *
 * 5. The workflow engine:
 *    - Takes a workflow definition with ordered steps
 *    - Executes steps sequentially
 *    - Handles passing context and outputs between steps
 *    - Logs execution progress
 *
 * Basic but extensible architecture for building automated workflows.
 */

// ---- Workflow ----
const workflow = {
  name: 'Sample Workflow',
  id: 'uuid-1234',
  steps: [
    { type: 'readVars' },
    { type: 'httpRequest' },
    { type: 'notify' },
    { type: 'updateVars' },
  ],
};

// ---- Conectors - steps ----
const readVarsStep = async (ctx) => {
  return {
    message: 'Hola desde Streamly!',
    userPhone: '+573001112233',
    ...ctx.vars,
  };
};

const httpRequestStep = async (ctx) => {
  console.log('[httpRequestStep] making fake request with:', ctx.query);

  const fakeResponse = {
    status: 200,
    data: { greeting: 'Hello!', timestamp: Date.now(), info: ctx.query },
  };

  return fakeResponse;
};

const notifyStep = async (ctx) => {
  // await sendNotification(ctx.vars.userPhone, ctx.vars.message);
  return { delivered: true };
};

const updateVarsStep = async (ctx, input) => {
  ctx.vars = { ...ctx.vars, ...input.data };
  return { updated: true };
};

// ---- Runtime - flow executor ----
const stepRegistry = {
  readVars: readVarsStep,
  httpRequest: httpRequestStep,
  notify: notifyStep,
  updateVars: updateVarsStep,
};

const runWorkflow = async (workflow, ctx) => {
  console.log('Running workflow:', workflow.name);
  let lastOutput = null;

  for (const step of workflow.steps) {
    const handler = stepRegistry[step.type];
    if (!handler) throw new Error(`Step type "${step.type}" not recognized.`);

    // Each step receives the global context and the output of the previous step

    console.log(`Executing step: ${step.type}`);

    if (step.type === 'updateVars') {
      lastOutput = await handler(ctx, lastOutput);
    } else {
      lastOutput = await handler(lastOutput || ctx);
    }

    console.log(`Step output:`, lastOutput);
  }

  console.log('Workflow completed. Final context vars:', ctx.vars);
  return lastOutput;
};

// ---- Run ----
(async () => {
  const context = {
    vars: {
      userId: 123,
    },
  };
  console.time();
  await runWorkflow(workflow, context);
  console.timeEnd();
})();
