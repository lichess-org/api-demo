import { Chess, Color } from 'chessops';
import { Ctrl } from './ctrl';
import { Api as CgApi } from 'chessground/api';
import { Stream } from './ndJsonStream';
import { parseFen } from 'chessops/fen';
import { Key } from 'chessground/types';
import { BoardCtrl } from './game';

interface TvGame {
  id: string;
  orientation: Color;
  players: [TvPlayer, TvPlayer];
  fen: string;
  lastMove?: string;
}

interface TvPlayer {
  color: Color;
  user: {
    name: string;
    title?: string;
  };
  rating: number;
  seconds?: number;
}

export default class TvCtrl implements BoardCtrl {
  ground?: CgApi;
  chess: Chess = Chess.default();
  lastUpdateAt: number = Date.now();
  redrawInterval: ReturnType<typeof setInterval>;
  constructor(readonly stream: Stream, public game: TvGame, readonly root: Ctrl) {
    this.onUpdate();
    this.redrawInterval = setInterval(root.redraw, 100);
    this.awaitClose();
  }

  awaitClose = async () => {
    await this.stream.closePromise;
  };

  onUnmount = () => {
    this.stream.close();
    clearInterval(this.redrawInterval);
  };

  player = (color: Color) => this.game.players[this.game.players[0].color == color ? 0 : 1];

  static open = (root: Ctrl): Promise<TvCtrl> =>
    new Promise<TvCtrl>(async resolve => {
      let ctrl: TvCtrl;
      let stream: Stream;
      const handler = (msg: any) => {
        if (ctrl) ctrl.handle(msg);
        else {
          // Gets the first game object from the first message of the stream,
          // make a TvCtrl from it, then forward the next messages to the ctrl
          ctrl = new TvCtrl(stream, msg.d, root);
          resolve(ctrl);
        }
      };
      stream = await root.auth.openStream('/api/tv/feed', {}, handler);
    });

  chessgroundConfig = () => {
    const chess = Chess.fromSetup(parseFen(this.game.fen).unwrap()).unwrap();
    const lm = this.game.lastMove;
    const lastMove = (lm ? (lm[1] === '@' ? [lm.slice(2)] : [lm[0] + lm[1], lm[2] + lm[3]]) : []) as Key[];
    return {
      orientation: this.game.orientation,
      fen: this.game.fen,
      lastMove,
      turnColor: chess.turn,
      check: !!chess.isCheck(),
      viewOnly: true,
      movable: { free: false },
      drawable: { visible: false },
      coordinates: false,
    };
  };

  setGround = (cg: CgApi) => (this.ground = cg);

  private onUpdate = () => {
    this.chess = Chess.fromSetup(parseFen(this.game.fen).unwrap()).unwrap();
    this.lastUpdateAt = Date.now();
  };

  private handle = (msg: any) => {
    switch (msg.t) {
      case 'featured':
        this.game = msg.d;
        this.onUpdate();
        this.root.redraw();
        break;
      case 'fen':
        this.game.fen = msg.d.fen;
        this.game.lastMove = msg.d.lm;
        this.player('white').seconds = msg.d.wc;
        this.player('black').seconds = msg.d.bc;
        this.onUpdate();
        this.ground?.set(this.chessgroundConfig());
        break;
    }
  };
}
