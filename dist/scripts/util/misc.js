/**
 * like findIndex, but reverse
 * @param {T[]} array
* @param {(value: T, index: number, array: T[]) => boolean} predicate
* @returns {number}
*/
export function findLastIndex(array, predicate) {
    let l = array.length;
    while (l--) {
        if (predicate(array[l], l, array))
            return l;
    }
    return -1;
}
