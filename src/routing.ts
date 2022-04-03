import { Ctrl } from './ctrl';
import page from 'page';

export default function (ctrl: Ctrl) {
  page.base(BASE_PATH);
  page('/', async ctx => {
    if (ctx.querystring.includes('code=liu_')) history.pushState({}, '', BASE_PATH || '/');
    ctrl.openHome();
  });
  page('/login', async _ => {
    if (ctrl.auth.me) return page('/');
    await ctrl.auth.login();
  });
  page('/logout', async _ => {
    await ctrl.auth.logout();
    location.href = BASE_PATH;
  });
  page('/game/:id', ctx => {
    ctrl.openGame(ctx.params.id);
  });
  page('/tv', ctx => ctrl.watchTv());
  page({ hashbang: true });
}

export const BASE_PATH = location.pathname.replace(/\/$/, '');

export const url = (path: string) => `${BASE_PATH}${path}`;
export const href = (path: string) => ({ href: url(path) });
