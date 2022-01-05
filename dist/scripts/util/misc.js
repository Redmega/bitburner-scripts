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
/** @param {number} time
* @param {undefined} showMilli* @returns {string}

*/
export function msToString(time, showMilli = true) {
    time = Math.floor(time);
    const millisecondsPerSecond = 1000;
    const secondPerMinute = 60;
    const minutesPerHours = 60;
    const secondPerHours = secondPerMinute * minutesPerHours;
    const hoursPerDays = 24;
    const secondPerDay = secondPerHours * hoursPerDays;
    // Convert ms to seconds, since we only have second-level precision
    const totalSeconds = Math.floor(time / millisecondsPerSecond);
    const days = Math.floor(totalSeconds / secondPerDay);
    const secTruncDays = totalSeconds % secondPerDay;
    const hours = Math.floor(secTruncDays / secondPerHours);
    const secTruncHours = secTruncDays % secondPerHours;
    const minutes = Math.floor(secTruncHours / secondPerMinute);
    const secTruncMinutes = secTruncHours % secondPerMinute;
    const milliTruncSec = (() => {
        let str = `${time % millisecondsPerSecond}`;
        while (str.length < 3)
            str = "0" + str;
        return str;
    })();
    const seconds = showMilli ? `${secTruncMinutes}.${milliTruncSec}` : `${secTruncMinutes}`;
    let res = "";
    if (days > 0) {
        res += `${days} days `;
    }
    if (hours > 0) {
        res += `${hours} hours `;
    }
    if (minutes > 0) {
        res += `${minutes} minutes `;
    }
    res += `${seconds} seconds`;
    return res;
}
