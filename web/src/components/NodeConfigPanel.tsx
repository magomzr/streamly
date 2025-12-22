import { type Node } from '@xyflow/react';
import type { StepData } from '../types.js';
import { STEP_SCHEMAS, type FieldSchema } from '@streamly/shared';
import { useState, useEffect } from 'react';
import { useExecutionStore } from '../stores/execution.js';

interface NodeConfigPanelProps {
  selectedNode: Node<StepData> | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<StepData>) => void;
  isDark: boolean;
}

export function NodeConfigPanel({
  selectedNode,
  onClose,
  onUpdate,
  isDark,
}: NodeConfigPanelProps) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const { result } = useExecutionStore();

  useEffect(() => {
    if (selectedNode?.data.settings) {
      setSettings(selectedNode.data.settings);
    } else {
      setSettings({});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const schema = STEP_SCHEMAS[selectedNode.data.stepType] || [];
  const stepOutput = result?.steps?.[selectedNode.data.stepId];

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(selectedNode.id, { label: e.target.value });
  };

  const handleSettingChange = (fieldName: string, value: any) => {
    const newSettings = { ...settings, [fieldName]: value };
    setSettings(newSettings);
    onUpdate(selectedNode.id, { settings: newSettings });
  };

  const renderField = (field: FieldSchema) => {
    const value = settings[field.name] ?? field.defaultValue ?? '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(field.name, e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {field.options?.map((opt: any) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleSettingChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleSettingChange(field.name, Number(e.target.value))
            }
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        );

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleSettingChange(field.name, e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderLeft: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        padding: '20px',
        overflowY: 'auto',
        boxShadow: isDark
          ? '-2px 0 8px rgba(0,0,0,0.5)'
          : '-2px 0 8px rgba(0,0,0,0.1)',
        color: isDark ? '#f3f4f6' : '#111827',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          Configure Step
        </h3>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#374151',
          }}
        >
          Step Type
        </label>
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          {selectedNode.data.stepType}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#374151',
          }}
        >
          Label (Display Name)
        </label>
        <input
          type="text"
          value={selectedNode.data.label}
          onChange={handleLabelChange}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#374151',
          }}
        >
          Step ID (for templates)
        </label>
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#166534',
          }}
        >
          {selectedNode.data.stepId}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '8px',
            color: '#374151',
          }}
        >
          Settings
        </label>
        {schema.length > 0 ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {schema.map((field: any) => (
              <div key={field.name}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    marginBottom: '6px',
                    color: '#374151',
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: '#ef4444' }}> *</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            No settings required
          </div>
        )}
      </div>

      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
        <strong>Node ID:</strong> {selectedNode.id}
      </div>

      {stepOutput && (
        <div
          style={{
            marginTop: '20px',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
          }}
        >
          <h4
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
            }}
          >
            Last Execution Output
          </h4>
          <div
            style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '11px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                color: '#374151',
              }}
            >
              {JSON.stringify(stepOutput, null, 2)}
            </pre>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
            Use{' '}
            <code
              style={{
                backgroundColor: '#f3f4f6',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
              }}
            >
              {'{{steps.' + selectedNode.data.stepId + '.fieldName}}'}
            </code>{' '}
            to reference this data
          </div>
        </div>
      )}
    </div>
  );
}
