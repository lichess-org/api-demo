import { Chessground } from 'chessground';
import { Color } from 'chessops';
import { h, VNode } from 'snabbdom';
import { BoardCtrl } from '../game';

export const renderBoard = (ctrl: BoardCtrl) =>
  h(
    'div.game-page__board',
    h(
      'div.cg-wrap',
      {
        hook: {
          insert(vnode) {
            ctrl.setGround(Chessground(vnode.elm as HTMLElement, ctrl.chessgroundConfig()));
          },
        },
      },
      'loading...'
    )
  );

export const renderPlayer = (
  ctrl: BoardCtrl,
  color: Color,
  clock: VNode,
  name: string,
  title?: string,
  rating?: number,
  aiLevel?: number
) => {
  return h(
    'div.game-page__player',
    {
      class: {
        turn: ctrl.chess.turn == color,
      },
    },
    [
      h('div.game-page__player__user', [
        title && h('span.game-page__player__user__title.display-5', title),
        h('span.game-page__player__user__name.display-5', aiLevel ? `Stockfish level ${aiLevel}` : name || 'Anon'),
        h('span.game-page__player__user__rating', rating || ''),
      ]),
      h('div.game-page__player__clock.display-6', clock),
    ]
  );
};
