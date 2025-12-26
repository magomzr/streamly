import { useEffect } from 'react';
import { type StepType } from '@streamly/shared';
import { useFlowStore } from '../stores/flow';
import { CategoryAccordion } from './CategoryAccordion';
import { Spinner } from './Spinner';
import { STEP_CATEGORIES } from '@streamly/shared';

interface SidebarProps {
  onLoadFlow: (flowId: string) => void;
  onNewFlow: () => void;
  isDark: boolean;
}

export function Sidebar({ onLoadFlow, onNewFlow, isDark }: SidebarProps) {
  const { flows, currentFlowId, isLoading, loadFlows, deleteFlow } =
    useFlowStore();

  useEffect(() => {
    loadFlows();
  }, [loadFlows]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this flow?')) {
      await deleteFlow(id);
    }
  };
  const onDragStart = (event: React.DragEvent, stepType: StepType) => {
    event.dataTransfer.setData('application/reactflow', stepType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '260px',
        height: '100%',
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        borderRight: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#f3f4f6' : '#111827',
          }}
        >
          Flows
        </h3>
        <button
          onClick={onNewFlow}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          + New Flow
        </button>
        {isLoading ? (
          <Spinner isDark={isDark} size={20} />
        ) : flows.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: '11px',
              padding: '8px',
            }}
          >
            No flows yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {flows.map((flow) => {
              const isCron = flow.triggerType === 'cron';
              const isEnabled = flow.enabled;
              return (
                <div
                  key={flow.id}
                  onClick={() => onLoadFlow(flow.id)}
                  style={{
                    padding: '6px 8px',
                    backgroundColor:
                      currentFlowId === flow.id
                        ? isDark
                          ? '#1e3a8a'
                          : '#dbeafe'
                        : isDark
                          ? '#374151'
                          : 'white',
                    border: `1px solid ${currentFlowId === flow.id ? (isDark ? '#3b82f6' : '#93c5fd') : isDark ? '#4b5563' : '#e5e7eb'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: isDark ? '#f3f4f6' : '#111827',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {isCron && (
                      <span
                        style={{
                          fontSize: '12px',
                          color: isEnabled ? '#10b981' : '#6b7280',
                        }}
                        title={
                          isEnabled
                            ? 'Scheduled (Active)'
                            : 'Scheduled (Inactive)'
                        }
                      >
                        ⏰
                      </span>
                    )}
                    <span
                      style={{
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {flow.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, flow.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '0 4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '16px', flex: 1 }}>
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#f3f4f6' : '#111827',
          }}
        >
          Steps
        </h3>

        <CategoryAccordion
          title="Control Flow"
          steps={STEP_CATEGORIES.controlFlow}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="HTTP"
          steps={STEP_CATEGORIES.http}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="Web Scraping"
          steps={STEP_CATEGORIES.webScraping}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="Notifications"
          steps={STEP_CATEGORIES.notifications}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="Data Manipulation"
          steps={STEP_CATEGORIES.dataManipulation}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="Encoding"
          steps={STEP_CATEGORIES.encoding}
          isDark={isDark}
          onDragStart={onDragStart}
        />
        <CategoryAccordion
          title="Utilities"
          steps={STEP_CATEGORIES.utilities}
          isDark={isDark}
          onDragStart={onDragStart}
        />
      </div>
    </div>
  );
}
