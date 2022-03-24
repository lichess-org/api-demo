import { Chessground } from 'chessground';
import { h } from 'snabbdom';
import { Ctrl } from '../ctrl';
import { Game, Renderer } from '../interfaces';
import OngoingGames from '../ongoingGames';
import { href } from '../routing';

export const renderHome: Renderer = ctrl => (ctrl.auth.me ? userHome(ctrl) : anonHome());

const userHome = (ctrl: Ctrl) => [
  h('div', [
    h('div.mt-5', [
      h(
        'button.btn.btn-primary.btn-lg',
        {
          attrs: { type: 'button' },
          on: { click: ctrl.playAi },
        },
        'Play the Lichess AI'
      ),
    ]),
    h('h2.mt-5', 'Games in progress'),
    h('div.games', renderGames(ctrl.games)),
    h('h2.mt-5', 'About'),
    renderAbout(),
  ]),
];

const renderGames = (ongoing: OngoingGames) =>
  ongoing.games.length ? ongoing.games.map(renderGameWidget) : [h('p', 'No ongoing games at the moment')];

const renderGameWidget = (game: Game) =>
  h(
    'a.game-widget.text-decoration-none',
    {
      attrs: href(`/game/${game.gameId}`),
    },
    [
      h('span.game-widget__opponent', [
        h('span.game-widget__opponent__name', game.opponent.username || 'Anon'),
        game.opponent.rating && h('span.game-widget__opponent__rating', game.opponent.rating),
      ]),
      h(
        'span.game-widget__board.cg-wrap',
        {
          hook: {
            insert(vnode) {
              const el = vnode.elm as HTMLElement;
              Chessground(el, {
                fen: game.fen,
                orientation: game.color,
                lastMove: game.lastMove.match(/.{1,2}/g),
                viewOnly: true,
                movable: { free: false },
                drawable: { visible: false },
                coordinates: false,
              });
            },
          },
        },
        'board'
      ),
    ]
  );

const anonHome = () => [
  h('div.login.text-center', [
    h('p', [
      'This client-side app demonstrates usage of the ',
      h('a', { attrs: { href: 'https://lichess.org/api' } }, 'Lichess API'),
      '.',
    ]),
    h('p', 'Please log in to continue.'),
    h(
      'a.btn.btn-primary.btn-lg.mt-5',
      {
        attrs: href('/login'),
      },
      'Login with Lichess'
    ),
  ]),
];

const renderAbout = () =>
  h('div.about', [
    h('p', 'This is an example for a fully client side OAuth app that uses various Lichess APIs.'),
    h('ul', [
      h(
        'li',
        h(
          'a',
          {
            attrs: { href: 'https://github.com/lichess-org/api-demo' },
          },
          'Source code of this demo'
        )
      ),
      h(
        'li',
        h(
          'a',
          {
            attrs: { href: 'https://lichess.org/api' },
          },
          'Lichess.org API documentation'
        )
      ),
    ]),
  ]);
