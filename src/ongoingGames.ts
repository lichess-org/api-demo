import { Game } from './interfaces';

export default class OngoingGames {
  games: Game[] = [];

  onStart = (game: Game) => {
    this.remove(game);
    this.games.push(game);
  };

  onFinish = (game: Game) => this.remove(game);

  private remove = (game: Game) => (this.games = this.games.filter(g => g.gameId != game.id));
}
