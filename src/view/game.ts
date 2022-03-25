import { Chessground } from 'chessground';
import { Color } from 'chessground/types';
import { opposite } from 'chessground/util';
import { h } from 'snabbdom';
import { GameCtrl } from '../game';
import { Renderer } from '../interfaces';
import { clockContent } from './clock';
import '../../scss/_game.scss';

export const renderGame: (ctrl: GameCtrl) => Renderer = ctrl => _ =>
  [
    h(
      `div.game-page.game-page--${ctrl.game.id}`,
      {
        hook: {
          destroy: ctrl.onUnmount,
        },
      },
      [
        renderPlayer(ctrl, opposite(ctrl.pov)),
        renderBoard(ctrl),
        renderPlayer(ctrl, ctrl.pov),
        ctrl.playing() ? renderButtons(ctrl) : renderState(ctrl),
      ]
    ),
  ];

const renderBoard = (ctrl: GameCtrl) =>
  h(
    'div.game-page__board',
    h(
      'div.cg-wrap',
      {
        hook: {
          insert(vnode) {
            ctrl.ground = Chessground(vnode.elm as HTMLElement, ctrl.chessgroundConfig());
          },
        },
      },
      'loading...'
    )
  );

const renderButtons = (ctrl: GameCtrl) =>
  h('div.btn-group.mt-4', [
    h(
      'button.btn.btn-secondary',
      {
        attrs: { type: 'button', disabled: !ctrl.playing() },
        on: {
          click() {
            if (confirm('Confirm?')) ctrl.resign();
          },
        },
      },
      ctrl.chess.fullmoves > 1 ? 'Resign' : 'Abort'
    ),
  ]);

const renderState = (ctrl: GameCtrl) => h('div.game-page__state', ctrl.game.state.status);

const renderPlayer = (ctrl: GameCtrl, color: Color) => {
  const p = ctrl.game[color];
  return h(
    'div.game-page__player',
    {
      class: {
        turn: ctrl.chess.turn == color,
      },
    },
    [
      h('div.game-page__player__user', [
        h(
          'span.game-page__player__user__name.display-5',
          p.aiLevel ? `Stockfish level ${p.aiLevel}` : p.name || 'Anon'
        ),
        h('span.game-page__player__user__rating', p.rating || ''),
      ]),
      h('div.game-page__player__clock.display-6.font-monospace', clockContent(ctrl, color)),
    ]
  );
};
