import { init, attributesModule, eventListenersModule, classModule } from 'snabbdom';
import { Ctrl } from './ctrl';
import view, { loadingBody } from './view/app';
import '../scss/_bootstrap.scss';
import '../scss/style.scss';
import '../node_modules/bootstrap/js/dist/dropdown.js';
import '../node_modules/bootstrap/js/dist/collapse.js';
import routing from './routing';

export default async function (element: HTMLElement) {
  const patch = init([attributesModule, eventListenersModule, classModule]);

  const ctrl = new Ctrl(redraw);

  let vnode = patch(element, loadingBody());

  function redraw() {
    vnode = patch(vnode, view(ctrl));
  }

  await ctrl.auth.init();
  routing(ctrl);
}
