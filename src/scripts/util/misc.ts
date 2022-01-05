/**
 * like findIndex, but reverse
 */
export function findLastIndex<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

export function msToString(time: number, showMilli = true): string {
  time = Math.floor(time);
  const millisecondsPerSecond = 1000;
  const secondPerMinute = 60;
  const minutesPerHours = 60;
  const secondPerHours: number = secondPerMinute * minutesPerHours;
  const hoursPerDays = 24;
  const secondPerDay: number = secondPerHours * hoursPerDays;

  // Convert ms to seconds, since we only have second-level precision
  const totalSeconds: number = Math.floor(time / millisecondsPerSecond);

  const days: number = Math.floor(totalSeconds / secondPerDay);
  const secTruncDays: number = totalSeconds % secondPerDay;

  const hours: number = Math.floor(secTruncDays / secondPerHours);
  const secTruncHours: number = secTruncDays % secondPerHours;

  const minutes: number = Math.floor(secTruncHours / secondPerMinute);
  const secTruncMinutes: number = secTruncHours % secondPerMinute;

  const milliTruncSec: string = (() => {
    let str = `${time % millisecondsPerSecond}`;
    while (str.length < 3) str = "0" + str;
    return str;
  })();

  const seconds: string = showMilli ? `${secTruncMinutes}.${milliTruncSec}` : `${secTruncMinutes}`;

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
