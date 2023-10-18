import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GameRepository } from './game.repository';
import { createGameID, createUserID } from 'src/ids';
import {
  AddScoreFields,
  AddUserFields,
  Game,
  JoinGameFields,
  RemoveUserFields,
} from './types';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createGame() {
    const userID = createUserID();
    const gameID = createGameID();

    const createdGame = await this.gameRepository.createGame({ gameID });
    this.logger.debug(
      `Creating token string for gameID: ${createdGame.id} and userID: ${userID}`,
    );

    const signedString = this.jwtService.sign(
      {
        gameID: createdGame.id,
      },
      {
        subject: userID,
      },
    );

    return {
      userID: userID,
      accessToken: signedString,
      game: createdGame,
    };
  }

  async joinGame({ gameID }: JoinGameFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching game with ID: ${gameID} for user with ID: ${userID}`,
    );

    const joinedGame = await this.gameRepository.getGame(gameID);

    this.logger.debug(
      `Creating token string for gameID: ${joinedGame.id} and userID: ${userID}`,
    );

    const signedString = this.jwtService.sign(
      {
        gameID: joinedGame.id,
      },
      {
        subject: userID,
      },
    );

    return {
      userID: userID,
      accessToken: signedString,
      game: joinedGame,
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
