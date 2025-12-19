import { IContext } from '../types';

/**
 * Resolves template variables in settings before step execution.
 * Supports nested objects and arrays.
 * Template syntax: {{path.to.value}}
 */
export function resolveTemplates(obj: any, ctx: IContext): any {
  if (typeof obj === 'string') {
    return resolveString(obj, ctx);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveTemplates(item, ctx));
  }

  if (obj && typeof obj === 'object') {
    const resolved: Record<string, any> = {};
    for (const key in obj) {
      resolved[key] = resolveTemplates(obj[key], ctx);
    }
    return resolved;
  }

  return obj;
}

/**
 * Resolves template variables in a string.
 * Example: "Hello {{vars.name}}" -> "Hello John"
 */
function resolveString(template: string, ctx: IContext): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = getValueByPath(ctx, path.trim());

    if (value === undefined || value === null) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  });
}

/**
 * Gets a value from an object using dot notation path.
 * Example: getValueByPath(ctx, "steps.fetchTodo.title")
 */
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
}
