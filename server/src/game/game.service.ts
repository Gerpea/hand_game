import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GameRepository } from './game.repository';
import { createGameID, createUserID } from 'src/ids';
import { AddScoreFields, AddUserFields, Game, RemoveUserFields } from './types';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createGame() {
    const gameID = createGameID();

    const createdGame = await this.gameRepository.createGame({ gameID });
    this.logger.debug(`Creating game with id: ${createdGame.id}`);

    return {
      game: createdGame,
    };
  }

  async getToken() {
    const userID = createUserID();

    this.logger.debug(`Creating token string for userID: ${userID}`);

    const signedString = this.jwtService.sign({
      sub: userID,
    });

    return {
      userID: userID,
      accessToken: signedString,
    };
  }

  async addUser(addUser: AddUserFields): Promise<Game> {
    return this.gameRepository.addUser(addUser);
  }

  async removeUser(addUser: RemoveUserFields): Promise<Game> {
    return this.gameRepository.removeUser(addUser);
  }

  async addScore(addScore: AddScoreFields): Promise<Game> {
    return this.gameRepository.addScore(addScore);
  }
}
