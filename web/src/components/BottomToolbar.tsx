import { useExecutionStore } from '../stores/execution.js';
import { VarsEditor } from './VarsEditor.js';

interface BottomToolbarProps {
  onExecute: () => void;
  vars: Record<string, any>;
  onVarsChange: (vars: Record<string, any>) => void;
}

export function BottomToolbar({
  onExecute,
  vars,
  onVarsChange,
}: BottomToolbarProps) {
  const { isExecuting } = useExecutionStore();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        zIndex: 20,
      }}
    >
      <button
        onClick={onExecute}
        disabled={isExecuting}
        style={{
          padding: '10px 24px',
          backgroundColor: isExecuting ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: isExecuting ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isExecuting) e.currentTarget.style.backgroundColor = '#059669';
        }}
        onMouseLeave={(e) => {
          if (!isExecuting) e.currentTarget.style.backgroundColor = '#10b981';
        }}
      >
        {isExecuting ? 'Executing...' : '▶ Run Flow'}
      </button>

      <VarsEditor vars={vars} onChange={onVarsChange} />
    </div>
  );
}
