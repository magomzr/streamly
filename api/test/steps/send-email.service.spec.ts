import { SendEmailStep } from '../../src/steps/notifications/send-email/send-email.service';
import type { IContext } from '../../src/types';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() =>
      Promise.resolve({
        messageId: '<test@gmail.com>',
        accepted: ['recipient@example.com'],
      }),
    ),
  })),
}));

describe('SendEmailStep', () => {
  let step: SendEmailStep;
  let ctx: IContext;

  beforeEach(() => {
    step = new SendEmailStep();
    ctx = {
      id: 'test-id',
      name: 'test-flow',
      vars: {},
      steps: {},
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  it('should send email successfully', async () => {
    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'test-password',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'Test body',
      html: false,
    };

    const result = await step.run(ctx, settings);

    expect(result.messageId).toBe('<test@gmail.com>');
    expect(result.accepted).toEqual(['recipient@example.com']);
    expect(ctx.logs).toHaveLength(2);
    expect(ctx.logs[0]).toContain('Sending email to');
    expect(ctx.logs[1]).toContain('Email sent successfully');
  });

  it('should send HTML email', async () => {
    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'test-password',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: '<h1>Test HTML</h1>',
      html: true,
    };

    const result = await step.run(ctx, settings);

    expect(result.messageId).toBeDefined();
    expect(ctx.logs[0]).toContain('Sending email to');
  });

  it('should handle multiple recipients', async () => {
    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'test-password',
      to: 'recipient1@example.com, recipient2@example.com',
      subject: 'Test Subject',
      body: 'Test body',
      html: false,
    };

    const result = await step.run(ctx, settings);

    expect(result.messageId).toBeDefined();
  });

  it('should log error on failure', async () => {
    const nodemailer = require('nodemailer');
    nodemailer.createTransport.mockReturnValueOnce({
      sendMail: jest.fn(() =>
        Promise.reject(new Error('Authentication failed')),
      ),
    });

    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'wrong-password',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'Test body',
      html: false,
    };

    await expect(step.run(ctx, settings)).rejects.toThrow(
      'Authentication failed',
    );
    expect(ctx.logs).toHaveLength(2);
    expect(ctx.logs[1]).toContain('ERROR');
    expect(ctx.logs[1]).toContain('Failed to send email');
  });

  it('should use template variables in body', async () => {
    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'test-password',
      to: 'recipient@example.com',
      subject: 'Hello {{vars.name}}',
      body: 'Your order {{vars.orderId}} is ready',
      html: false,
    };

    const result = await step.run(ctx, settings);

    expect(result.messageId).toBeDefined();
  });

  it('should handle empty body', async () => {
    const settings = {
      email: 'sender@gmail.com',
      appPassword: 'test-password',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: '',
      html: false,
    };

    const result = await step.run(ctx, settings);

    expect(result.messageId).toBeDefined();
  });
});
