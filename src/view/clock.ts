import { Color } from 'chessops';
import { h, VNode } from 'snabbdom';
import { GameCtrl } from '../game';

export function clockContent(ctrl: GameCtrl, color: Color): Array<string | VNode> {
  const time = ctrl.timeOf(color);
  if (!time && time !== 0) return ['-'];
  if (time == 2147483647) return [];

  const decay =
    color == ctrl.chess.turn && ctrl.chess.fullmoves > 1 && ctrl.playing() ? ctrl.lastUpdateAt - Date.now() : 0;
  const millis = time + decay;

  return millis > 1000 * 60 * 60 * 24 ? correspondence(millis) : realTime(millis);
}

const realTime = (millis: number) => {
  const date = new Date(millis);
  return [
    pad2(date.getUTCMinutes()) + ':' + pad2(date.getUTCSeconds()),
    h('tenths', '.' + Math.floor(millis / 100).toString()),
  ];
};

function correspondence(ms: number) {
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
  return [str];
}

const pad2 = (num: number) => (num < 10 ? '0' : '') + num;
const prefixInteger = (num: number, length: number): string => (num / Math.pow(10, length)).toFixed(length).slice(2);
const bold = (x: string) => `<b>${x}</b>`;
