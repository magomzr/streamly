export function createStepLog(
  level: 'INFO' | 'WARN' | 'ERROR',
  stepName: string,
  message: string,
): string {
  const timestamp = new Date().toISOString();
  return `[${level}] ${timestamp} ${stepName}: ${message}`;
}
