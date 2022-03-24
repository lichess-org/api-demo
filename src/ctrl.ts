import { Auth } from './auth';
import { GameCtrl } from './game';
import { Page } from './interfaces';
import { readStream } from './ndJsonStream';
import { formData, sleep } from './util';
import OngoingGames from './ongoingGames';
import page from 'page';

export class Ctrl {
  auth: Auth = new Auth();
  page: Page = 'home';
  games = new OngoingGames();
  game?: GameCtrl;

  constructor(readonly redraw: () => void) {}

  openGame = async (id: string) => {
    this.game = undefined;
    this.redraw();
    this.game = await GameCtrl.open(this, id);
    this.redraw();
  };

  playAi = async () => {
    this.game = undefined;
    this.page = 'game';
    this.redraw();
    const game = await this.auth.fetchBody('/api/challenge/ai', {
      method: 'post',
      body: formData({
        level: 1,
        'clock.limit': 60 * 3,
        'clock.increment': 2,
      }),
    });
    page(`/game/${game.id}`);
  };

  startEventStream = async () => {
    if (this.auth.me) {
      const stream = await this.auth.fetchResponse('/api/stream/event');
      await readStream(this.messageHandler)(stream);
      await sleep(3000);
      await this.startEventStream(); // reconnect
    }
  };

  private messageHandler = (msg: any) => {
    switch (msg.type) {
      case 'gameStart':
        this.games.onStart(msg.game);
        this.redraw();
        break;
      case 'gameFinish':
        this.games.onFinish(msg.game);
        this.redraw();
        break;
      default:
        console.error(`Unknown message type: ${msg.type}`, msg);
    }
  };
}
