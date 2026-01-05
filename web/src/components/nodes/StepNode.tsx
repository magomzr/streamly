import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StepData } from '../../types.js';
import { useExecutionStore } from '../../stores/execution.js';

interface StepNodeProps extends NodeProps {
  data: StepData;
}

export const StepNode = memo(({ data, selected, id }: StepNodeProps) => {
  const { stepProgress } = useExecutionStore();
  const progress = stepProgress[id];

  const getNodeColor = (stepType: string) => {
    if (stepType === 'conditional') return '#ec4899';
    if (stepType.includes('http') || stepType === 'webhook') return '#3b82f6';
    if (stepType.includes('html') || stepType.includes('extract'))
      return '#14b8a6';
    if (stepType.includes('sms')) return '#10b981';
    if (
      stepType.includes('array') ||
      stepType.includes('transform') ||
      stepType.includes('json')
    )
      return '#8b5cf6';
    if (stepType.includes('base64') || stepType.includes('string'))
      return '#f59e0b';
    return '#6b7280';
  };

  const color = getNodeColor(data.stepType);

  const getStatusColor = () => {
    if (!progress) return color;
    switch (progress.status) {
      case 'running':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return color;
    }
  };

  const statusColor = getStatusColor();

  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: '8px',
        border: `2px solid ${selected ? statusColor : '#e5e7eb'}`,
        backgroundColor: progress?.status === 'running' ? '#eff6ff' : 'white',
        minWidth: '180px',
        boxShadow: selected
          ? `0 0 0 2px ${statusColor}40`
          : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: statusColor,
            animation:
              progress?.status === 'running' ? 'pulse 1.5s infinite' : 'none',
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
          {data.label}
        </div>
        {progress?.status === 'running' && (
          <div
            style={{
              fontSize: '10px',
              color: '#3b82f6',
              fontWeight: 600,
            }}
          >
            ⟳
          </div>
        )}
        {progress?.status === 'completed' && (
          <div style={{ fontSize: '12px', color: '#10b981' }}>✓</div>
        )}
        {progress?.status === 'error' && (
          <div style={{ fontSize: '12px', color: '#ef4444' }}>✕</div>
        )}
      </div>

      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
        {data.stepType}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete step "${data.label}"?`)) {
            const event = new CustomEvent('deleteNode', {
              detail: { nodeId: id },
            });
            window.dispatchEvent(event);
          }
        }}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '20px',
          height: '20px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: selected ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#fecaca')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#fee2e2')
        }
      >
        ×
      </button>

      {data.stepType === 'conditional' ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            style={{ top: '35%', background: '#10b981' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            style={{ top: '65%', background: '#ef4444' }}
          />
        </>
      ) : (
        <Handle type="source" position={Position.Right} id="default" />
      )}
    </div>
  );
});

StepNode.displayName = 'StepNode';
