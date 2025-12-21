import { useState } from 'react';
import { createPortal } from 'react-dom';

interface VarsEditorProps {
  vars: Record<string, any>;
  onChange: (vars: Record<string, any>) => void;
}

export function VarsEditor({ vars, onChange }: VarsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<Array<{ key: string; value: string }>>(
    Object.entries(vars).map(([key, value]) => ({ key, value: String(value) })),
  );

  const handleOpen = () => {
    setEntries(
      Object.entries(vars).map(([key, value]) => ({
        key,
        value: String(value),
      })),
    );
    setIsOpen(true);
  };

  const handleSave = () => {
    const newVars: Record<string, any> = {};
    entries.forEach(({ key, value }) => {
      if (key.trim()) {
        newVars[key.trim()] = value;
      }
    });
    onChange(newVars);
    setIsOpen(false);
  };

  const addEntry = () => {
    setEntries([...entries, { key: '', value: '' }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (
    index: number,
    field: 'key' | 'value',
    newValue: string,
  ) => {
    setEntries(
      entries.map((entry, i) =>
        i === index ? { ...entry, [field]: newValue } : entry,
      ),
    );
  };

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          padding: '8px 16px',
          backgroundColor: 'white',
          color: '#6b7280',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>⚙️</span>
        Variables
        {Object.keys(vars).length > 0 && (
          <span
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {Object.keys(vars).length}
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
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
              zIndex: 9999,
            }}
            onClick={() => setIsOpen(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  Flow Variables
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                  Define global variables accessible in all steps via{' '}
                  <code>{'{{vars.variableName}}'}</code>
                </p>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Variable name"
                      value={entry.key}
                      onChange={(e) =>
                        updateEntry(index, 'key', e.target.value)
                      }
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={entry.value}
                      onChange={(e) =>
                        updateEntry(index, 'value', e.target.value)
                      }
                      style={{
                        flex: 2,
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      onClick={() => removeEntry(index)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  onClick={addEntry}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px dashed #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  + Add Variable
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setIsOpen(false)}
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
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Save Variables
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
