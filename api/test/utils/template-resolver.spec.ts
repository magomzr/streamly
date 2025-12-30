import { resolveTemplates } from '../../src/utils/template-resolver';
import { IContext } from '../../src/types';

describe('Template Resolver', () => {
  let ctx: IContext;

  beforeEach(() => {
    ctx = {
      id: 'test-id',
      name: 'test-flow',
      vars: {
        name: 'John',
        age: 30,
        city: 'New York',
      },
      steps: {
        fetchUser: {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
        },
        fetchTodos: [
          { id: 1, title: 'Task 1' },
          { id: 2, title: 'Task 2' },
        ],
      },
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  describe('string templates', () => {
    it('should resolve simple variable', () => {
      const result = resolveTemplates('Hello {{vars.name}}', ctx);
      expect(result).toBe('Hello John');
    });

    it('should resolve multiple variables', () => {
      const result = resolveTemplates(
        '{{vars.name}} is {{vars.age}} years old',
        ctx,
      );
      expect(result).toBe('John is 30 years old');
    });

    it('should resolve step output', () => {
      const result = resolveTemplates(
        'User: {{steps.fetchUser.username}}',
        ctx,
      );
      expect(result).toBe('User: johndoe');
    });

    it('should return empty string for undefined values', () => {
      const result = resolveTemplates('Value: {{vars.nonexistent}}', ctx);
      expect(result).toBe('Value: ');
    });

    it('should return empty string for null values', () => {
      ctx.vars.nullValue = null;
      const result = resolveTemplates('Value: {{vars.nullValue}}', ctx);
      expect(result).toBe('Value: ');
    });
  });

  describe('single template (entire string)', () => {
    it('should return value directly for single template', () => {
      const result = resolveTemplates('{{vars.age}}', ctx);
      expect(result).toBe(30);
    });

    it('should preserve arrays', () => {
      const result = resolveTemplates('{{steps.fetchTodos}}', ctx);
      expect(result).toEqual([
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ]);
    });

    it('should preserve objects', () => {
      const result = resolveTemplates('{{steps.fetchUser}}', ctx);
      expect(result).toEqual({
        id: 1,
        username: 'johndoe',
        email: 'john@example.com',
      });
    });

    it('should return empty string for undefined single template', () => {
      const result = resolveTemplates('{{vars.nonexistent}}', ctx);
      expect(result).toBe('');
    });
  });

  describe('objects', () => {
    it('should resolve templates in object values', () => {
      const obj = {
        greeting: 'Hello {{vars.name}}',
        age: '{{vars.age}}',
      };

      const result = resolveTemplates(obj, ctx);

      expect(result).toEqual({
        greeting: 'Hello John',
        age: 30,
      });
    });

    it('should resolve nested objects', () => {
      const obj = {
        user: {
          name: '{{vars.name}}',
          location: '{{vars.city}}',
        },
      };

      const result = resolveTemplates(obj, ctx);

      expect(result).toEqual({
        user: {
          name: 'John',
          location: 'New York',
        },
      });
    });
  });

  describe('arrays', () => {
    it('should resolve templates in arrays', () => {
      const arr = ['{{vars.name}}', '{{vars.city}}', 'static'];

      const result = resolveTemplates(arr, ctx);

      expect(result).toEqual(['John', 'New York', 'static']);
    });

    it('should resolve nested arrays', () => {
      const arr = [['{{vars.name}}'], ['{{vars.age}}']];

      const result = resolveTemplates(arr, ctx);

      expect(result).toEqual([['John'], [30]]);
    });
  });

  describe('complex nested structures', () => {
    it('should resolve deeply nested structures', () => {
      const obj = {
        users: [
          {
            name: '{{vars.name}}',
            details: {
              age: '{{vars.age}}',
              city: '{{vars.city}}',
            },
          },
        ],
      };

      const result = resolveTemplates(obj, ctx);

      expect(result).toEqual({
        users: [
          {
            name: 'John',
            details: {
              age: 30,
              city: 'New York',
            },
          },
        ],
      });
    });
  });

  describe('object values in templates', () => {
    it('should stringify objects when embedded in strings', () => {
      const result = resolveTemplates('User: {{steps.fetchUser}}', ctx);
      expect(result).toBe(
        'User: {"id":1,"username":"johndoe","email":"john@example.com"}',
      );
    });

    it('should stringify arrays when embedded in strings', () => {
      const result = resolveTemplates('Todos: {{steps.fetchTodos}}', ctx);
      expect(result).toBe(
        'Todos: [{"id":1,"title":"Task 1"},{"id":2,"title":"Task 2"}]',
      );
    });
  });

  describe('primitives', () => {
    it('should return numbers unchanged', () => {
      const result = resolveTemplates(42, ctx);
      expect(result).toBe(42);
    });

    it('should return booleans unchanged', () => {
      const result = resolveTemplates(true, ctx);
      expect(result).toBe(true);
    });

    it('should return null unchanged', () => {
      const result = resolveTemplates(null, ctx);
      expect(result).toBe(null);
    });

    it('should return undefined unchanged', () => {
      const result = resolveTemplates(undefined, ctx);
      expect(result).toBe(undefined);
    });
  });

  describe('secret references', () => {
    it('should NOT resolve secret references (single template)', () => {
      const result = resolveTemplates('{{secret.API_KEY}}', ctx);
      expect(result).toBe('{{secret.API_KEY}}');
    });

    it('should NOT resolve secret references (embedded)', () => {
      const result = resolveTemplates('Key: {{secret.API_KEY}}', ctx);
      expect(result).toBe('Key: {{secret.API_KEY}}');
    });

    it('should NOT resolve secret references in objects', () => {
      const obj = {
        apiKey: '{{secret.API_KEY}}',
        name: '{{vars.name}}',
      };

      const result = resolveTemplates(obj, ctx);

      expect(result).toEqual({
        apiKey: '{{secret.API_KEY}}',
        name: 'John',
      });
    });

    it('should NOT resolve secret references in arrays', () => {
      const arr = ['{{secret.KEY1}}', '{{vars.name}}', '{{secret.KEY2}}'];

      const result = resolveTemplates(arr, ctx);

      expect(result).toEqual(['{{secret.KEY1}}', 'John', '{{secret.KEY2}}']);
    });

    it('should handle mixed templates with secrets', () => {
      const result = resolveTemplates(
        'User {{vars.name}} with key {{secret.API_KEY}}',
        ctx,
      );
      expect(result).toBe('User John with key {{secret.API_KEY}}');
    });

    it('should preserve secret references in nested structures', () => {
      const obj = {
        auth: {
          user: '{{vars.name}}',
          token: '{{secret.AUTH_TOKEN}}',
        },
        headers: {
          'X-API-Key': '{{secret.API_KEY}}',
        },
      };

      const result = resolveTemplates(obj, ctx);

      expect(result).toEqual({
        auth: {
          user: 'John',
          token: '{{secret.AUTH_TOKEN}}',
        },
        headers: {
          'X-API-Key': '{{secret.API_KEY}}',
        },
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const result = resolveTemplates('', ctx);
      expect(result).toBe('');
    });

    it('should handle strings without templates', () => {
      const result = resolveTemplates('No templates here', ctx);
      expect(result).toBe('No templates here');
    });

    it('should handle malformed templates', () => {
      const result = resolveTemplates('{{incomplete', ctx);
      expect(result).toBe('{{incomplete');
    });

    it('should handle empty objects', () => {
      const result = resolveTemplates({}, ctx);
      expect(result).toEqual({});
    });

    it('should handle empty arrays', () => {
      const result = resolveTemplates([], ctx);
      expect(result).toEqual([]);
    });

    it('should handle whitespace in template paths', () => {
      const result = resolveTemplates('{{ vars.name }}', ctx);
      expect(result).toBe('John');
    });
  });
});
