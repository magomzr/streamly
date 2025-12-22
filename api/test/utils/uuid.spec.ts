import { generateUUID } from '../../src/utils/uuid';

describe('UUID', () => {
  it('should generate valid UUID format', () => {
    const uuid = generateUUID();

    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(uuid1).not.toBe(uuid2);
  });

  it('should have correct length', () => {
    const uuid = generateUUID();

    expect(uuid.length).toBe(36);
  });

  it('should have version 4 indicator', () => {
    const uuid = generateUUID();

    expect(uuid.charAt(14)).toBe('4');
  });

  it('should have correct variant bits', () => {
    const uuid = generateUUID();
    const variantChar = uuid.charAt(19);

    expect(['8', '9', 'a', 'b']).toContain(variantChar);
  });
});
