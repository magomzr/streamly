import { useExecutionStore } from '../stores/execution.js';

interface ExecutionViewProps {
  onClose: () => void;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}min`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

export function ExecutionView({ onClose }: ExecutionViewProps) {
  const { result, error, isExecuting } = useExecutionStore();

  if (!result && !error && !isExecuting) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '300px',
        backgroundColor: 'white',
        borderTop: '2px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          Execution Results
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {result && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor:
                  result.status === 'completed'
                    ? '#d1fae5'
                    : result.status === 'failed'
                      ? '#fee2e2'
                      : '#dbeafe',
                color:
                  result.status === 'completed'
                    ? '#065f46'
                    : result.status === 'failed'
                      ? '#991b1b'
                      : '#1e40af',
              }}
            >
              {result.status.toUpperCase()}
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {isExecuting && (
          <div
            style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}
          >
            <div style={{ fontSize: '14px' }}>Executing flow...</div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#991b1b',
              fontSize: '14px',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <h4
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Logs ({result.logs.length})
              </h4>
              <div
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '6px',
                  padding: '12px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              >
                {result.logs.map((log, i) => (
                  <div
                    key={i}
                    style={{ color: '#e5e7eb', marginBottom: '4px' }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {result.error && (
              <div>
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#991b1b',
                  }}
                >
                  Error Details
                </h4>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <strong>Step:</strong>{' '}
                    {result.error.stepName || result.error.stepId}
                  </div>
                  <div>
                    <strong>Message:</strong> {result.error.message}
                  </div>
                  <div>
                    <strong>Attempt:</strong> {result.error.attempt}
                  </div>
                </div>
              </div>
            )}

            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              <strong>Started:</strong>{' '}
              {new Date(result.startedAt).toLocaleString()}
              {result.completedAt && (
                <>
                  {' | '}
                  <strong>Completed:</strong>{' '}
                  {new Date(result.completedAt).toLocaleString()}
                  {' | '}
                  <strong>Duration:</strong>{' '}
                  {formatDuration(
                    new Date(result.completedAt).getTime() -
                      new Date(result.startedAt).getTime(),
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
