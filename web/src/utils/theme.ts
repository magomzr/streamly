export const getThemeColors = (isDark: boolean) => ({
  bg: isDark ? '#1f2937' : '#ffffff',
  bgSecondary: isDark ? '#374151' : '#f9fafb',
  border: isDark ? '#4b5563' : '#e5e7eb',
  text: isDark ? '#f3f4f6' : '#111827',
  textSecondary: isDark ? '#9ca3af' : '#6b7280',
  input: isDark ? '#374151' : '#ffffff',
});
