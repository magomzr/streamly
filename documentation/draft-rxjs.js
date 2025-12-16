const { of, from, map, concatMap, switchMap, tap } = require('rxjs');

const flow = [
  { type: 'readVars' },
  { type: 'httpCall', url: 'https://api.example.com/data' },
  { type: 'notify', channel: 'sms' },
  { type: 'updateContext', key: 'status', value: 'done' },
];

// Mock services
function httpCall(url) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: 'value-from-api', url }), 500),
  );
}
function sendSms(msg) {
  return Promise.resolve(`SMS sent with: ${msg}`);
}

function sendEmail(msg) {
  return Promise.resolve(`Email sent with: ${msg}`);
}

// Registry

const handlers = {
  readVars: (step, ctx) => {
    return of({
      ...ctx,
      vars: { initial: true, message: 'Hello from vars' },
    });
  },

  httpCall: (step, ctx) => {
    return from(httpCall(step.url)).pipe(
      map((result) => ({
        ...ctx,
        apiResult: result.data,
      })),
    );
  },

  notify: (step, ctx) => {
    const message = ctx.apiResult;
    const send = step.channel === 'sms' ? sendSms : sendEmail;

    return from(send(message)).pipe(
      map((result) => ({
        ...ctx,
        notification: result,
      })),
    );
  },

  updateContext: (step, ctx) => {
    return of({
      ...ctx,
      [step.key]: step.value,
    });
  },
};

// Engine

const executeFlow = (flow) => {
  return from(flow).pipe(
    // Execute each step sequentially
    concatMap((step) =>
      of(step).pipe(
        // Execute the real handler of the step
        switchMap((s) => handlers[s.type](s, currentContext)),
        tap((newCtx) => {
          console.log(`[LOG] Step ${step.type} executed`, newCtx);
        }),
        map((newCtx) => {
          currentContext = newCtx; // update context
          return newCtx;
        }),
      ),
    ),
  );
};

// Use

let currentContext = {};

console.time();
executeFlow(flow).subscribe(() => {});
console.timeEnd();
