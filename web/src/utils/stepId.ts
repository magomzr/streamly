export function toSnakeCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, '') // For special chars
    .replaceAll(/\s+/g, '_') // Replace spaces with underscore
    .replaceAll(/_+/g, '_') // For duplicate underscores
    .replaceAll(/^_|_$/g, ''); // For leading/trailing underscores
}

export function generateUniqueStepId(
  baseId: string,
  existingIds: string[],
): string {
  const snakeId = toSnakeCase(baseId);

  if (!existingIds.includes(snakeId)) {
    return snakeId;
  }

  // Find next available number
  let counter = 1;
  let newId: string;

  do {
    const suffix = counter.toString().padStart(2, '0');
    newId = `${snakeId}_${suffix}`;
    counter++;
  } while (existingIds.includes(newId));

  return newId;
}
