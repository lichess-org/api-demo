import { h } from 'snabbdom';
import { Renderer } from '../interfaces';
import { url } from '../routing';
import { SeekCtrl } from '../seek';
import { spinner } from './app';
import '../../scss/_seek.scss';

export const renderSeek: (ctrl: SeekCtrl) => Renderer = ctrl => _ =>
  [
    h(
      'div.seek-page',
      {
        hook: {
          destroy: ctrl.onUnmount,
        },
      },
      [
        h('div.seek-page__awaiting', [spinner(), h('span.ms-3', 'Awaiting a game...')]),
        h(
          'a.btn.btn-secondary',
          {
            attrs: { href: url('/') },
          },
          'Cancel'
        ),
      ]
    ),
  ];
