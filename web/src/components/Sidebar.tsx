import { STEP_LABELS, STEP_CATEGORIES, type StepType } from '../types/steps.js';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, stepType: StepType) => {
    event.dataTransfer.setData('application/reactflow', stepType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderCategory = (title: string, steps: readonly StepType[]) => (
    <div key={title} style={{ marginBottom: '20px' }}>
      <h4
        style={{
          margin: '0 0 8px 0',
          fontSize: '12px',
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {steps.map((stepType) => (
          <div
            key={stepType}
            draggable
            onDragStart={(e) => onDragStart(e, stepType)}
            style={{
              padding: '10px 12px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'grab',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow =
                '0 1px 3px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
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
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        padding: '20px',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>
        Steps
      </h3>

      {renderCategory('HTTP', STEP_CATEGORIES.http)}
      {renderCategory('Notifications', STEP_CATEGORIES.notifications)}
      {renderCategory('Data Manipulation', STEP_CATEGORIES.dataManipulation)}
      {renderCategory('Encoding', STEP_CATEGORIES.encoding)}
      {renderCategory('Utilities', STEP_CATEGORIES.utilities)}
    </div>
  );
}
