/**
 * FNV-1a Hash implementation
 * 32-bit FNV-1a hash for string content.
 * Fast, synchronous, and consistent across environments.
 */
export function contentHash(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}
