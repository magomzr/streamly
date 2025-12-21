import { createStepLog } from '../../src/utils/logger';

describe('Logger', () => {
  it('should create INFO log', () => {
    const log = createStepLog('INFO', 'TestStep', 'Test message');

    expect(log).toContain('[INFO]');
    expect(log).toContain('TestStep');
    expect(log).toContain('Test message');
  });

  it('should create WARN log', () => {
    const log = createStepLog('WARN', 'TestStep', 'Warning message');

    expect(log).toContain('[WARN]');
    expect(log).toContain('Warning message');
  });

  it('should create ERROR log', () => {
    const log = createStepLog('ERROR', 'TestStep', 'Error message');

    expect(log).toContain('[ERROR]');
    expect(log).toContain('Error message');
  });

  it('should include timestamp', () => {
    const log = createStepLog('INFO', 'TestStep', 'Message');

    expect(log).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should format log correctly', () => {
    const log = createStepLog('INFO', 'MyStep', 'My message');

    expect(log).toMatch(/\[INFO\] .+ MyStep: My message/);
  });
});
