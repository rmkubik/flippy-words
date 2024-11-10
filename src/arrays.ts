export function update<T>(array: T[], index: number, value: T) {
  if (index < 0) throw new Error(`Cannot update negative index.`);
  if (index > array.length - 1)
    throw new Error(`Cannot update index greater than array bounds.`);
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
