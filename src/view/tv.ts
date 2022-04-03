import { Color } from 'chessground/types';
import { opposite } from 'chessground/util';
import { h } from 'snabbdom';
import TvCtrl from '../tv';
import { Renderer } from '../interfaces';
import { clockContent } from './clock';
import { renderBoard, renderPlayer } from './board';

export const renderTv: (ctrl: TvCtrl) => Renderer = ctrl => _ =>
  [
    h(
      `div.game-page.game-page--${ctrl.game.id}`,
      {
        hook: {
          destroy: ctrl.onUnmount,
        },
      },
      [
        renderTvPlayer(ctrl, opposite(ctrl.game.orientation)),
        renderBoard(ctrl),
        renderTvPlayer(ctrl, ctrl.game.orientation),
      ]
    ),
  ];

const renderTvPlayer = (ctrl: TvCtrl, color: Color) => {
  const p = ctrl.player(color);
  const clock = clockContent(
    p.seconds && p.seconds * 1000,
    color == ctrl.chess.turn ? ctrl.lastUpdateAt - Date.now() : 0
  );
  return renderPlayer(ctrl, color, clock, p.user.name, p.user.title, p.rating);
};
