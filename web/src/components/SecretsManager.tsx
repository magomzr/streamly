import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Secret {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface SecretsManagerProps {
  isDark: boolean;
  onClose: () => void;
}

export function SecretsManager({ isDark, onClose }: SecretsManagerProps) {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSecret, setEditingSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', value: '' });

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = async () => {
    try {
      const data = await apiService.getSecrets();
      setSecrets(data);
    } catch (error) {
      alert('Failed to load secrets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.value) {
      alert('Name and value are required');
      return;
    }
    try {
      await apiService.createSecret(formData.name, formData.value);
      setFormData({ name: '', value: '' });
      setShowCreateModal(false);
      loadSecrets();
    } catch (error) {
      alert('Failed to create secret');
    }
  };

  const handleUpdate = async () => {
    if (!editingSecret || !formData.value) {
      alert('Value is required');
      return;
    }
    try {
      await apiService.updateSecret(editingSecret, formData.value);
      setFormData({ name: '', value: '' });
      setEditingSecret(null);
      loadSecrets();
    } catch (error) {
      alert('Failed to update secret');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete secret "${name}"?`)) return;
    try {
      await apiService.deleteSecret(name);
      loadSecrets();
    } catch (error) {
      alert('Failed to delete secret');
    }
  };

  const copyReference = (name: string) => {
    navigator.clipboard.writeText(`{{secret.${name}}}`);
    alert('Reference copied to clipboard!');
  };

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
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          >
            Secrets Manager
          </h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          + New Secret
        </button>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        ) : secrets.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            No secrets yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {secrets.map((secret) => (
              <div
                key={secret.id}
                style={{
                  padding: '12px',
                  backgroundColor: isDark ? '#374151' : '#f9fafb',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: isDark ? '#f3f4f6' : '#111827',
                      }}
                    >
                      {secret.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                        marginTop: '4px',
                      }}
                    >
                      Value: ••••••••
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => copyReference(secret.name)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                        color: isDark ? '#f3f4f6' : '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        setEditingSecret(secret.name);
                        setFormData({ name: secret.name, value: '' });
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                        color: isDark ? '#f3f4f6' : '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit value
                    </button>
                    <button
                      onClick={() => handleDelete(secret.name)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(showCreateModal || editingSecret) && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: isDark ? '#374151' : '#f9fafb',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              borderRadius: '6px',
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
              {editingSecret ? 'Update Secret' : 'Create Secret'}
            </h4>
            {!editingSecret && (
              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    marginBottom: '4px',
                    color: isDark ? '#d1d5db' : '#374151',
                  }}
                >
                  Name (uppercase, underscores only)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9_]/g, ''),
                    })
                  }
                  placeholder="MY_SECRET"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    backgroundColor: isDark ? '#1f2937' : 'white',
                    color: isDark ? '#f3f4f6' : '#111827',
                  }}
                />
              </div>
            )}
            <div style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  marginBottom: '4px',
                  color: isDark ? '#d1d5db' : '#374151',
                }}
              >
                Value
              </label>
              <input
                type="password"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder="Enter secret value"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  color: isDark ? '#f3f4f6' : '#111827',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={editingSecret ? handleUpdate : handleCreate}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {editingSecret ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSecret(null);
                  setFormData({ name: '', value: '' });
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                  color: isDark ? '#f3f4f6' : '#374151',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
