interface SpinnerProps {
  isDark?: boolean;
  size?: number;
}

export function Spinner({ isDark = false, size = 24 }: SpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `3px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          borderTop: `3px solid ${isDark ? '#60a5fa' : '#3b82f6'}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
