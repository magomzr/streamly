import { useState } from 'react';
import { STEP_LABELS, type StepType } from '@streamly/shared';

interface CategoryAccordionProps {
  title: string;
  steps: readonly StepType[];
  isDark: boolean;
  onDragStart: (event: React.DragEvent, stepType: StepType) => void;
}

export function CategoryAccordion({
  title,
  steps,
  isDark,
  onDragStart,
}: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 10px',
          backgroundColor: isDark ? '#374151' : '#f3f4f6',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 600,
          color: isDark ? '#f3f4f6' : '#374151',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '10px' }}>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginTop: '6px',
          }}
        >
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
      )}
    </div>
  );
}
