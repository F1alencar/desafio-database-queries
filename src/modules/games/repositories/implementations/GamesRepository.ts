import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
    .createQueryBuilder("game").select().where(`title ~* :params`, {params: param}).getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    
    return this.repository.createQueryBuilder()
    .select("user")
    .from(User, "user")
    .leftJoinAndMapMany('user.games', 'users_games_games', 'game', 'game.usersId = user.id').where('game.gamesId = :params', {params: id})
    .getMany()
    
      // Complete usando query builder
  }
}
