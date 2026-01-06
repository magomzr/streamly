interface WelcomeModalProps {
  onClose: () => void;
  isDark: boolean;
}

export function WelcomeModal({ onClose, isDark }: WelcomeModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        width: '90%',
        maxWidth: '500px',
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.15)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isDark ? '#9ca3af' : '#6b7280',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: 600,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          >
            Streamly
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            Your workflow automation engine
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: isDark ? '#f3f4f6' : '#111827',
              }}
            >
              Explore your flows
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: isDark ? '#9ca3af' : '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Select an existing flow from the left panel or create a new one
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: isDark ? '#f3f4f6' : '#111827',
              }}
            >
              Build visually
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: isDark ? '#9ca3af' : '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Drag and drop steps from the sidebar to create your workflow
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
            }}
          >
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: isDark ? '#f3f4f6' : '#111827',
              }}
            >
              Execute and monitor
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: isDark ? '#9ca3af' : '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Run your flows and watch real-time progress with visual indicators
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
