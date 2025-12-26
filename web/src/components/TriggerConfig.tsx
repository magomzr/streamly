import { useState } from 'react';
import type { ITriggerConfig } from '@streamly/shared';

interface TriggerConfigProps {
  trigger?: ITriggerConfig;
  onChange: (trigger: ITriggerConfig) => void;
  isDark?: boolean;
}

const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at 9 AM', value: '0 9 * * *' },
  { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
];

export function TriggerConfig({
  trigger,
  onChange,
  isDark,
}: TriggerConfigProps) {
  const [type, setType] = useState<'http' | 'cron'>(trigger?.type || 'http');
  const [cronExpression, setCronExpression] = useState(
    trigger?.cronExpression || '*/5 * * * *',
  );
  const [enabled, setEnabled] = useState(trigger?.enabled || false);
  const [showPresets, setShowPresets] = useState(false);

  const handleTypeChange = (newType: 'http' | 'cron') => {
    setType(newType);
    onChange({
      type: newType,
      cronExpression: newType === 'cron' ? cronExpression : undefined,
      enabled: newType === 'cron' ? enabled : false,
    });
  };

  const handleCronChange = (value: string) => {
    setCronExpression(value);
    onChange({ type: 'cron', cronExpression: value, enabled });
  };

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value);
    onChange({ type, cronExpression, enabled: value });
  };

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        borderRadius: '8px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      }}
    >
      <h4
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: 600,
          color: isDark ? '#f3f4f6' : '#111827',
        }}
      >
        Trigger Configuration
      </h4>

      <div style={{ marginBottom: '12px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '6px',
            color: isDark ? '#d1d5db' : '#374151',
          }}
        >
          Trigger Type
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleTypeChange('http')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor:
                type === 'http' ? '#3b82f6' : isDark ? '#374151' : 'white',
              color: type === 'http' ? 'white' : isDark ? '#d1d5db' : '#6b7280',
              border: `1px solid ${type === 'http' ? '#3b82f6' : isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            HTTP Request
          </button>
          <button
            onClick={() => handleTypeChange('cron')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor:
                type === 'cron' ? '#3b82f6' : isDark ? '#374151' : 'white',
              color: type === 'cron' ? 'white' : isDark ? '#d1d5db' : '#6b7280',
              border: `1px solid ${type === 'cron' ? '#3b82f6' : isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ⏰ Scheduled (Cron)
          </button>
        </div>
      </div>

      {type === 'cron' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '6px',
                color: isDark ? '#d1d5db' : '#374151',
              }}
            >
              Cron Expression
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => handleCronChange(e.target.value)}
                placeholder="*/5 * * * *"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  color: isDark ? '#f3f4f6' : '#111827',
                }}
              />
              <button
                onClick={() => setShowPresets(!showPresets)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px 8px',
                  backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  color: isDark ? '#d1d5db' : '#6b7280',
                }}
              >
                Presets
              </button>
            </div>
            {showPresets && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: isDark ? '#374151' : 'white',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {CRON_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      handleCronChange(preset.value);
                      setShowPresets(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: isDark ? '#d1d5db' : '#374151',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = isDark
                        ? '#4b5563'
                        : '#f3f4f6')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <div style={{ fontWeight: 500 }}>{preset.label}</div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      {preset.value}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div
              style={{
                marginTop: '6px',
                fontSize: '11px',
                color: isDark ? '#9ca3af' : '#6b7280',
              }}
            >
              Format: minute hour day month weekday
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: isDark ? '#d1d5db' : '#374151',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleEnabledChange(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Enable scheduled execution
            </label>
          </div>

          {enabled && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: isDark ? '#065f46' : '#d1fae5',
                border: `1px solid ${isDark ? '#047857' : '#a7f3d0'}`,
                borderRadius: '6px',
                fontSize: '12px',
                color: isDark ? '#d1fae5' : '#065f46',
              }}
            >
              ✓ Flow will run automatically based on schedule
            </div>
          )}
        </>
      )}

      {type === 'http' && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
            border: `1px solid ${isDark ? '#1e40af' : '#bfdbfe'}`,
            borderRadius: '6px',
            fontSize: '12px',
            color: isDark ? '#dbeafe' : '#1e40af',
          }}
        >
          Flow will be triggered manually or via HTTP request
        </div>
      )}
    </div>
  );
}
