import { useState } from 'react';
import type { ITriggerConfig } from '@streamly/shared';
import { VarsEditor } from './VarsEditor.js';

interface OptionsPanelProps {
  trigger: ITriggerConfig;
  onTriggerChange: (trigger: ITriggerConfig) => void;
  vars: Record<string, any>;
  onVarsChange: (vars: Record<string, any>) => void;
  onAutoLayout: () => void;
  onValidate: () => void;
  onExport: () => void;
  onImport: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
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

export function OptionsPanel({
  trigger,
  onTriggerChange,
  vars,
  onVarsChange,
  onAutoLayout,
  onValidate,
  onExport,
  onImport,
  isDark,
  onToggleTheme,
}: OptionsPanelProps) {
  const [type, setType] = useState<'http' | 'cron'>(trigger?.type || 'http');
  const [cronExpression, setCronExpression] = useState(
    trigger?.cronExpression || '*/5 * * * *',
  );
  const [enabled, setEnabled] = useState(trigger?.enabled || false);
  const [showPresets, setShowPresets] = useState(false);
  const [showVarsEditor, setShowVarsEditor] = useState(false);

  const handleTypeChange = (newType: 'http' | 'cron') => {
    setType(newType);
    onTriggerChange({
      type: newType,
      cronExpression: newType === 'cron' ? cronExpression : undefined,
      enabled: newType === 'cron' ? enabled : false,
    });
  };

  const handleCronChange = (value: string) => {
    setCronExpression(value);
    onTriggerChange({ type: 'cron', cronExpression: value, enabled });
  };

  const handleEnabledChange = (value: boolean) => {
    setEnabled(value);
    onTriggerChange({ type, cronExpression, enabled: value });
  };

  return (
    <div
      style={{
        width: '320px',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderRadius: '8px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        boxShadow: isDark
          ? '0 2px 8px rgba(0,0,0,0.5)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Trigger Section */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
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
          Trigger
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
            Type
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleTypeChange('http')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor:
                  type === 'http' ? '#3b82f6' : isDark ? '#374151' : 'white',
                color:
                  type === 'http' ? 'white' : isDark ? '#d1d5db' : '#6b7280',
                border: `1px solid ${type === 'http' ? '#3b82f6' : isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              HTTP
            </button>
            <button
              onClick={() => handleTypeChange('cron')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor:
                  type === 'cron' ? '#3b82f6' : isDark ? '#374151' : 'white',
                color:
                  type === 'cron' ? 'white' : isDark ? '#d1d5db' : '#6b7280',
                border: `1px solid ${type === 'cron' ? '#3b82f6' : isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ⏰ Cron
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
                Expression
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
                ✓ Flow will run automatically
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
            Manual or HTTP trigger
          </div>
        )}
      </div>

      {/* Variables Section */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          >
            Variables
          </h4>
          <span
            style={{
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            {Object.keys(vars).length} defined
          </span>
        </div>
        <button
          onClick={() => setShowVarsEditor(true)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: isDark ? '#374151' : 'white',
            color: isDark ? '#d1d5db' : '#374151',
            border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Edit Variables
        </button>
      </div>

      {/* Actions Section */}
      <div style={{ padding: '16px' }}>
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: isDark ? '#f3f4f6' : '#111827',
          }}
        >
          Actions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onAutoLayout}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: isDark ? '#374151' : 'white',
              color: isDark ? '#d1d5db' : '#374151',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            Auto Layout
          </button>
          <button
            onClick={onValidate}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: isDark ? '#374151' : 'white',
              color: isDark ? '#d1d5db' : '#374151',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            ✓ Validate Flow
          </button>
          <button
            onClick={onToggleTheme}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: isDark ? '#374151' : 'white',
              color: isDark ? '#d1d5db' : '#374151',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {isDark ? '☀️' : '☽️'} {isDark ? 'Light' : 'Dark'} Mode
          </button>
          <button
            onClick={onExport}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: isDark ? '#374151' : 'white',
              color: isDark ? '#d1d5db' : '#374151',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            ↓ Export JSON
          </button>
          <button
            onClick={onImport}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: isDark ? '#374151' : 'white',
              color: isDark ? '#d1d5db' : '#374151',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '13px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            ↑ Import JSON
          </button>
        </div>
      </div>

      {showVarsEditor && (
        <VarsEditor
          vars={vars}
          onChange={(newVars: Record<string, any>) => {
            onVarsChange(newVars);
            setShowVarsEditor(false);
          }}
          onClose={() => setShowVarsEditor(false)}
        />
      )}
    </div>
  );
}
