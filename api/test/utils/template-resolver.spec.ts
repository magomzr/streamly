import { resolveTemplates } from '../../src/utils/template-resolver';
import { IContext } from '../../src/types';

describe('Template Resolver', () => {
  let ctx: IContext;

  beforeEach(() => {
    ctx = {
      id: '123',
      name: 'Test Flow',
      vars: {
        userName: 'John',
        count: 42,
      },
      steps: {
        fetchTodos: [
          { id: 1, title: 'Todo 1', completed: true },
          { id: 2, title: 'Todo 2', completed: false },
          { id: 3, title: 'Todo 3', completed: true },
        ],
        fetchUser: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      logs: [],
      status: 'running',
      startedAt: new Date(),
    };
  });

  describe('Array handling', () => {
    it('should preserve array when template is a single reference', () => {
      const settings = {
        array: '{{steps.fetchTodos}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(Array.isArray(resolved.array)).toBe(true);
      expect(resolved.array).toHaveLength(3);
      expect(resolved.array[0]).toEqual({
        id: 1,
        title: 'Todo 1',
        completed: true,
      });
    });

    it('should stringify array when template is part of a string', () => {
      const settings = {
        message: 'Todos: {{steps.fetchTodos}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(typeof resolved.message).toBe('string');
      expect(resolved.message).toContain('Todos: [');
    });
  });

  describe('Object handling', () => {
    it('should preserve object when template is a single reference', () => {
      const settings = {
        user: '{{steps.fetchUser}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(typeof resolved.user).toBe('object');
      expect(resolved.user).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should access nested object properties', () => {
      const settings = {
        email: '{{steps.fetchUser.email}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.email).toBe('john@example.com');
    });
  });

  describe('String interpolation', () => {
    it('should replace simple variable', () => {
      const settings = {
        message: 'Hello {{vars.userName}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.message).toBe('Hello John');
    });

    it('should replace multiple variables', () => {
      const settings = {
        message: 'User: {{vars.userName}}, Count: {{vars.count}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.message).toBe('User: John, Count: 42');
    });

    it('should handle nested properties', () => {
      const settings = {
        message: 'Email: {{steps.fetchUser.email}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.message).toBe('Email: john@example.com');
    });
  });

  describe('Edge cases', () => {
    it('should return empty string for undefined values', () => {
      const settings = {
        value: '{{steps.nonExistent}}',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.value).toBe('');
    });

    it('should handle nested objects in settings', () => {
      const settings = {
        payload: {
          user: '{{vars.userName}}',
          data: {
            email: '{{steps.fetchUser.email}}',
          },
        },
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.payload.user).toBe('John');
      expect(resolved.payload.data.email).toBe('john@example.com');
    });

    it('should preserve non-template strings', () => {
      const settings = {
        message: 'No templates here',
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.message).toBe('No templates here');
    });

    it('should preserve numbers and booleans', () => {
      const settings = {
        count: 42,
        active: true,
      };

      const resolved = resolveTemplates(settings, ctx);

      expect(resolved.count).toBe(42);
      expect(resolved.active).toBe(true);
    });
  });
});
