import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface Execution {
  id: string;
  flowId: string;
  status: string;
  triggeredBy: string;
  createdAt: string;
  context: any;
}

interface ExecutionHistoryProps {
  flowId: string;
  onClose: () => void;
  isDark?: boolean;
}

export function ExecutionHistory({
  flowId,
  onClose,
  isDark,
}: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    null,
  );

  useEffect(() => {
    loadExecutions();
  }, [flowId]);

  const loadExecutions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getExecutions(flowId);
      setExecutions(data);
    } catch (error) {
      console.error('Failed to load executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string, isDark: boolean) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return isDark ? '#065f46' : '#d1fae5';
      case 'failed':
        return isDark ? '#7f1d1d' : '#fee2e2';
      case 'success':
        return isDark ? '#065f46' : '#d1fae5';
      case 'error':
        return isDark ? '#7f1d1d' : '#fee2e2';
      default:
        return isDark ? '#374151' : '#f3f4f6';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    return trigger === 'cron' ? '⏰' : '▶️';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          >
            Execution History
          </h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              width: selectedExecution ? '40%' : '100%',
              borderRight: selectedExecution
                ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                : 'none',
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: isDark ? '#9ca3af' : '#6b7280',
                }}
              >
                Loading...
              </div>
            ) : executions.length === 0 ? (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: isDark ? '#9ca3af' : '#6b7280',
                }}
              >
                No executions yet
              </div>
            ) : (
              executions.map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => setSelectedExecution(exec)}
                  style={{
                    padding: '16px',
                    borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    cursor: 'pointer',
                    backgroundColor:
                      selectedExecution?.id === exec.id
                        ? isDark
                          ? '#374151'
                          : '#f3f4f6'
                        : 'transparent',
                    borderLeft: `4px solid ${getStatusColor(exec.status)}`,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedExecution?.id !== exec.id) {
                      e.currentTarget.style.backgroundColor = isDark
                        ? '#2d3748'
                        : '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedExecution?.id !== exec.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>
                        {getTriggerIcon(exec.triggeredBy)}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: getStatusBgColor(
                            exec.status,
                            isDark || false,
                          ),
                          color: getStatusColor(exec.status),
                          textTransform: 'uppercase',
                        }}
                      >
                        {exec.status}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      {formatDate(exec.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                    }}
                  >
                    ID: {exec.id.slice(0, 8)}...
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedExecution && (
            <div
              style={{
                width: '60%',
                overflowY: 'auto',
                padding: '20px',
                backgroundColor: isDark ? '#111827' : '#f9fafb',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h4
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isDark ? '#f3f4f6' : '#111827',
                  }}
                >
                  Execution Details
                </h4>
                <div
                  style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  <strong>ID:</strong> {selectedExecution.id}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  <strong>Status:</strong>{' '}
                  <span
                    style={{ color: getStatusColor(selectedExecution.status) }}
                  >
                    {selectedExecution.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  <strong>Triggered by:</strong> {selectedExecution.triggeredBy}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                  }}
                >
                  <strong>Date:</strong>{' '}
                  {formatDate(selectedExecution.createdAt)}
                </div>
              </div>

              {selectedExecution.context.logs &&
                selectedExecution.context.logs.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isDark ? '#f3f4f6' : '#111827',
                      }}
                    >
                      Logs ({selectedExecution.context.logs.length})
                    </h4>
                    <div
                      style={{
                        backgroundColor: isDark ? '#1f2937' : 'white',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '6px',
                        padding: '12px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                      }}
                    >
                      {selectedExecution.context.logs.map(
                        (log: any, idx: number) => (
                          <div key={idx}>{log}</div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {(!selectedExecution.context.logs ||
                selectedExecution.context.logs.length === 0) && (
                <div style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? '#f3f4f6' : '#111827',
                    }}
                  >
                    Logs
                  </h4>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      textAlign: 'center',
                    }}
                  >
                    No logs available
                  </div>
                </div>
              )}

              {selectedExecution.context.output && (
                <div>
                  <h4
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDark ? '#f3f4f6' : '#111827',
                    }}
                  >
                    Output
                  </h4>
                  <pre
                    style={{
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      padding: '12px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      fontSize: '11px',
                      color: isDark ? '#d1d5db' : '#374151',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {JSON.stringify(selectedExecution.context.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
