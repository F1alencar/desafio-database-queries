import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user_info = await this.repository.findOne({where: {id: user_id}})
    const user_games = await this.repository.query(`Select title from users as u left join users_games_games as g on u.id = g."usersId" left join games on games.id = g."gamesId" where u.id = $1`, [user_id])
    
    if (user_info && user_games){
      user_info.games = user_games
      return user_info
    }
    
    return undefined
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`select * from users order by users.first_name`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query('SELECT * FROM users as u WHERE u.first_name ~* $1 and u.last_name ~* $2', [first_name, last_name]);
    return users  // Complete usando raw query
  }
}
