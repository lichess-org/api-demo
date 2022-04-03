import { h, VNode } from 'snabbdom';

export function clockContent(time?: number, decay?: number): VNode {
  if (!time && time !== 0) return h('span', '-');
  if (time == 2147483647) return h('span');

  const millis = time + (decay || 0);

  return millis > 1000 * 60 * 60 * 24 ? correspondence(millis) : realTime(millis);
}

const realTime = (millis: number) => {
  const date = new Date(millis);

  return h('span.clock--realtime.font-monospace', [
    pad2(date.getUTCMinutes()) + ':' + pad2(date.getUTCSeconds()),
    h('tenths', '.' + Math.floor(date.getUTCMilliseconds() / 100).toString()),
  ]);
};

const correspondence = (ms: number) => {
  const date = new Date(ms),
    minutes = prefixInteger(date.getUTCMinutes(), 2),
    seconds = prefixInteger(date.getSeconds(), 2);
  let hours: number,
    str = '';
  if (ms >= 86400 * 1000) {
    // days : hours
    const days = date.getUTCDate() - 1;
    hours = date.getUTCHours();
    str += (days === 1 ? 'One day' : `${days} days`) + ' ';
    if (hours !== 0) str += `${hours} hours`;
  } else if (ms >= 3600 * 1000) {
    // hours : minutes
    hours = date.getUTCHours();
    str += bold(prefixInteger(hours, 2)) + ':' + bold(minutes);
  } else {
    // minutes : seconds
    str += bold(minutes) + ':' + bold(seconds);
  }
  return h('span.clock--correspondence', str);
};

const pad2 = (num: number) => (num < 10 ? '0' : '') + num;
const prefixInteger = (num: number, length: number): string => (num / Math.pow(10, length)).toFixed(length).slice(2);
const bold = (x: string) => `<b>${x}</b>`;
