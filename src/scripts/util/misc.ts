/**
 * like findIndex, but reverse
 */
export function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}
