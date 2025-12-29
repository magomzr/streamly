import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface ActiveFlow {
  id: string;
  name: string;
  cronExpression: string;
  enabled: boolean;
  isActive: boolean;
}

interface ActiveFlowsMonitorProps {
  isDark: boolean;
  refreshTrigger?: number;
}

export function ActiveFlowsMonitor({
  isDark,
  refreshTrigger,
}: ActiveFlowsMonitorProps) {
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load count always (lightweight)
  useEffect(() => {
    loadActiveCount();
  }, [refreshTrigger]);

  // Load full details only when expanded
  useEffect(() => {
    if (isExpanded) {
      loadActiveFlows();
    }
  }, [isExpanded, refreshTrigger]);

  const loadActiveCount = async () => {
    try {
      const { active } = await apiService.getActiveFlowsCount();
      setActiveCount(active);
    } catch (error) {
      console.error('Failed to load active count:', error);
    }
  };

  const loadActiveFlows = async () => {
    setLoading(true);
    try {
      const flows = await apiService.getActiveScheduledFlows();
      setActiveFlows(flows);
      setActiveCount(flows.filter((f) => f.isActive).length);
    } catch (error) {
      console.error('Failed to load active flows:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalScheduled = activeFlows.length;

  return (
    <div
      style={{
        borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        backgroundColor: isDark ? '#111827' : '#f9fafb',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          background: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📊</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          >
            Active Flows
          </span>
          {activeCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px',
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <span
          style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '12px' }}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div style={{ padding: '0 16px 12px 16px' }}>
          {loading && activeFlows.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
              }}
            >
              Loading...
            </div>
          ) : activeFlows.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
              }}
            >
              No scheduled flows
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: '11px',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: '8px',
                }}
              >
                {activeCount} of {totalScheduled} running
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {activeFlows.map((flow) => (
                  <div
                    key={flow.id}
                    style={{
                      padding: '8px',
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '4px',
                      fontSize: '11px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: isDark ? '#f3f4f6' : '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {flow.name}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {flow.isActive ? (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#10b981',
                              display: 'inline-block',
                            }}
                            title="Active"
                          />
                        ) : (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#6b7280',
                              display: 'inline-block',
                            }}
                            title="Inactive"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontFamily: 'monospace',
                      }}
                    >
                      {flow.cronExpression}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
