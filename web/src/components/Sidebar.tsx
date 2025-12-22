import { useEffect } from 'react';
import { STEP_LABELS, STEP_CATEGORIES, type StepType } from '@streamly/shared';
import { useFlowStore } from '../stores/flow';

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

  const renderCategory = (title: string, steps: readonly StepType[]) => (
    <div key={title} style={{ marginBottom: '16px' }}>
      <h4
        style={{
          margin: '0 0 6px 0',
          fontSize: '11px',
          fontWeight: 600,
          color: isDark ? '#9ca3af' : '#6b7280',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {steps.map((stepType) => (
          <div
            key={stepType}
            draggable
            onDragStart={(e) => onDragStart(e, stepType)}
            style={{
              padding: '8px 10px',
              backgroundColor: isDark ? '#374151' : 'white',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'grab',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'all 0.2s',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow =
                '0 1px 3px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark
                ? '#4b5563'
                : '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {STEP_LABELS[stepType]}
          </div>
        ))}
      </div>
    </div>
  );

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
          <div
            style={{
              textAlign: 'center',
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: '11px',
              padding: '8px',
            }}
          >
            Loading...
          </div>
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
            {flows.map((flow) => (
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
            ))}
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

        {renderCategory('Control Flow', STEP_CATEGORIES.controlFlow)}
        {renderCategory('HTTP', STEP_CATEGORIES.http)}
        {renderCategory('Notifications', STEP_CATEGORIES.notifications)}
        {renderCategory('Data Manipulation', STEP_CATEGORIES.dataManipulation)}
        {renderCategory('Encoding', STEP_CATEGORIES.encoding)}
        {renderCategory('Utilities', STEP_CATEGORIES.utilities)}
      </div>
    </div>
  );
}
