import { h, VNode } from 'snabbdom';
import { Ctrl } from '../ctrl';
import { Renderer } from '../interfaces';
import layout from './layout';
import { renderChallenge } from './challenge';
import { renderGame } from './game';
import { renderHome } from './home';
import { renderSeek } from './seek';
import { renderTv } from './tv';

export default function view(ctrl: Ctrl): VNode {
  return layout(ctrl, selectRenderer(ctrl)(ctrl));
}

const selectRenderer = (ctrl: Ctrl): Renderer => {
  if (ctrl.page == 'game') return ctrl.game ? renderGame(ctrl.game) : renderLoading;
  if (ctrl.page == 'home') return renderHome;
  if (ctrl.page == 'seek' && ctrl.seek) return renderSeek(ctrl.seek);
  if (ctrl.page == 'challenge' && ctrl.challenge) return renderChallenge(ctrl.challenge);
  if (ctrl.page == 'tv') return ctrl.tv ? renderTv(ctrl.tv) : renderLoading;
  return renderNotFound;
};

const renderLoading: Renderer = _ => [loadingBody()];

const renderNotFound: Renderer = _ => [h('h1', 'Not found')];

export const loadingBody = () => h('div.loading', spinner());

export const spinner = () =>
  h('div.spinner-border.text-primary', { attrs: { role: 'status' } }, h('span.visually-hidden', 'Loading...'));
