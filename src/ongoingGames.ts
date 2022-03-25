import { Game } from './interfaces';
import page from 'page';

export default class OngoingGames {
  games: Game[] = [];
  autoStart: Set<string> = new Set();

  onStart = (game: Game) => {
    this.remove(game);
    if (game.compat.board) {
      this.games.push(game);
      if (!this.autoStart.has(game.id)) {
        if (!game.hasMoved) page(`/game/${game.gameId}`);
      }
      this.autoStart.add(game.id);
    } else console.log(`Skipping game ${game.gameId}, not board compatible`);
  };

  onFinish = (game: Game) => this.remove(game);

  empty = () => {
    this.games = [];
  };

  private remove = (game: Game) => {
    this.games = this.games.filter(g => g.gameId != game.id);
  };
}
