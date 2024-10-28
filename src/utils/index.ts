import { v4 as randomUUID } from 'uuid';

/**
 Merges an array of strings with a given joiner
 @param {Array<string|undefined>} strings - The array of strings to merge
 @param {string} [joiner=' '] - The string to join the strings with
 @returns {string} The merged string
 */
export const mergeStrings = (
  strings: Array<string | undefined | null>,
  joiner: string = ' ',
): string => {
  return strings.filter(Boolean).join(joiner);
};

export const UUIDv4 = () => randomUUID();
