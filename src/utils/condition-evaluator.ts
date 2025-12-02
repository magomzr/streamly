import { IContext } from '../types';

export function evaluateCondition(condition: string, ctx: IContext): boolean {
  if (condition === 'default' || condition === 'true') {
    return true;
  }

  if (condition === 'false') {
    return false;
  }

  try {
    const replaced = replaceTemplateVariables(condition, ctx);
    return eval(replaced);
  } catch (error) {
    return false;
  }
}

function replaceTemplateVariables(template: string, ctx: IContext): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const value = getValueByPath(ctx, path.trim());
    return JSON.stringify(value);
  });
}

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
