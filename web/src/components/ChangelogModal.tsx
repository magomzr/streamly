import changelogData from '../data/changelog.json';

interface ChangelogModalProps {
  onClose: () => void;
  isDark: boolean;
}

export function ChangelogModal({ onClose, isDark }: ChangelogModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '12px',
          padding: '32px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.7)'
            : '0 20px 50px rgba(0,0,0,0.15)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
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
            See what's changed.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            v{changelogData.version}
          </p>
        </div>

        <ul
          style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {changelogData.changes.map((change, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '14px',
                color: isDark ? '#d1d5db' : '#374151',
                lineHeight: 1.6,
              }}
            >
              {change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
