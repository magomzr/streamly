import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StepData } from '../../types/steps.js';

interface StepNodeProps extends NodeProps {
  data: StepData;
}

export const StepNode = memo(({ data, selected }: StepNodeProps) => {
  const getNodeColor = (stepType: string) => {
    if (stepType.includes('http') || stepType === 'webhook') return '#3b82f6';
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

  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: '8px',
        border: `2px solid ${selected ? color : '#e5e7eb'}`,
        backgroundColor: 'white',
        minWidth: '180px',
        boxShadow: selected
          ? `0 0 0 2px ${color}40`
          : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
          {data.label}
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
        {data.stepType}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

StepNode.displayName = 'StepNode';
