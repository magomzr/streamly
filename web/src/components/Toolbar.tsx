import { useExecutionStore } from '../stores/execution.js';

interface ToolbarProps {
  onExecute: () => void;
  vars: Record<string, any>;
  onVarsChange: (vars: Record<string, any>) => void;
}

import { VarsEditor } from './VarsEditor.js';

export function Toolbar({ onExecute, vars, onVarsChange }: ToolbarProps) {
  const { isExecuting, reset } = useExecutionStore();

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      <button
        onClick={onExecute}
        disabled={isExecuting}
        style={{
          padding: '8px 20px',
          backgroundColor: isExecuting ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: isExecuting ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isExecuting) e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseLeave={(e) => {
          if (!isExecuting) e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
      >
        {isExecuting ? 'Executing...' : '▶ Run Flow'}
      </button>

      <button
        onClick={reset}
        style={{
          padding: '8px 16px',
          backgroundColor: 'white',
          color: '#6b7280',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Clear
      </button>

      <VarsEditor vars={vars} onChange={onVarsChange} />
    </div>
  );
}
