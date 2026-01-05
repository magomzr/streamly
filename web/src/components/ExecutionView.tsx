import { useExecutionStore } from '../stores/execution.js';
import { useState, useRef, useEffect } from 'react';

interface ExecutionViewProps {
  onClose: () => void;
}

type TabType = 'logs' | 'steps' | 'output';

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}min`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

export function ExecutionView({ onClose }: ExecutionViewProps) {
  const { result, error, isExecuting } = useExecutionStore();
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [isMinimized, setIsMinimized] = useState(false);
  const [height, setHeight] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    if (!isMinimized && result) {
      setActiveTab('logs');
    }
  }, [result, isMinimized]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const delta = startY.current - e.clientY;
      const newHeight = Math.min(
        Math.max(startHeight.current + delta, 200),
        window.innerHeight - 150,
      );
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = height;
  };

  if (!result && !error && !isExecuting) return null;

  const minimizedHeight = 48;
  const currentHeight = isMinimized ? minimizedHeight : height;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        maxWidth: 'calc(100vw - 560px)',
        height: `${currentHeight}px`,
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        zIndex: 15,
        transition: isResizing ? 'none' : 'height 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Resize Handle - Top only */}
      {!isMinimized && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            cursor: 'ns-resize',
            backgroundColor: 'transparent',
            zIndex: 20,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#3b82f620')
          }
          onMouseLeave={(e) =>
            !isResizing &&
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        />
      )}

      {/* Header with Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: '48px',
          borderBottom: isMinimized ? 'none' : '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!isMinimized && (
            <>
              <button
                onClick={() => setActiveTab('logs')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor:
                    activeTab === 'logs' ? '#ffffff' : 'transparent',
                  color: activeTab === 'logs' ? '#111827' : '#6b7280',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Logs
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor:
                    activeTab === 'steps' ? '#ffffff' : 'transparent',
                  color: activeTab === 'steps' ? '#111827' : '#6b7280',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Steps
              </button>
              <button
                onClick={() => setActiveTab('output')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  backgroundColor:
                    activeTab === 'output' ? '#ffffff' : 'transparent',
                  color: activeTab === 'output' ? '#111827' : '#6b7280',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Output
              </button>
            </>
          )}
          {isMinimized && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}
              >
                ⚡ Execution
              </span>
              {result && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 600,
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
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!isMinimized && result && (
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
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px 8px',
              lineHeight: 1,
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px 8px',
              lineHeight: 1,
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {isExecuting && (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}
            >
              <div style={{ fontSize: '14px' }}>⚡ Executing flow...</div>
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
                marginBottom: '16px',
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && activeTab === 'logs' && (
            <div>
              <div
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  maxHeight: `${height - 120}px`,
                  overflowY: 'auto',
                }}
              >
                {result.logs.map((log, i) => (
                  <div
                    key={i}
                    style={{
                      color: '#e5e7eb',
                      marginBottom: '4px',
                      lineHeight: '1.5',
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
              {result.error && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '6px',
                    fontSize: '13px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#991b1b',
                    }}
                  >
                    ❌ Error Details
                  </div>
                  <div style={{ color: '#7f1d1d' }}>
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
            </div>
          )}

          {result && activeTab === 'steps' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {Object.entries(result.steps).map(
                ([name, data]: [string, any]) => (
                  <div
                    key={name}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: '4px',
                        color: '#111827',
                      }}
                    >
                      {name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {data._metadata && (
                        <div>
                          Type: {data._metadata.stepType} | Executed:{' '}
                          {new Date(
                            data._metadata.executedAt,
                          ).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
              {result.startedAt && result.completedAt && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '8px',
                  }}
                >
                  <strong>Duration:</strong>{' '}
                  {formatDuration(
                    new Date(result.completedAt).getTime() -
                      new Date(result.startedAt).getTime(),
                  )}
                </div>
              )}
            </div>
          )}

          {result && activeTab === 'output' && (
            <div>
              <pre
                style={{
                  backgroundColor: '#1f2937',
                  color: '#e5e7eb',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  overflowX: 'auto',
                  maxHeight: `${height - 120}px`,
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
