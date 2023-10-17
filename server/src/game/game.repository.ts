import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IO_REDIS_KEY } from 'src/redis.module';
import {
  AddScoreData,
  AddUserData,
  CreateGameData,
  Game,
  RemoveUserData,
} from './types';

@Injectable()
export class GameRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(GameRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IO_REDIS_KEY) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('GAME_DURATION');
  }

  async createGame({ gameID }: CreateGameData): Promise<Game> {
    const initialGame: Game = {
      id: gameID,
      users: {},
      scores: {},
    };

    this.logger.log(
      `Creating new game: ${JSON.stringify(initialGame, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `games:${gameID}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialGame)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialGame;
    } catch (e) {
      this.logger.error(
        `Failed to add game ${JSON.stringify(initialGame)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getGame(gameID: string): Promise<Game> {
    this.logger.log(`Attempting to get game with: ${gameID}`);
    const key = `games:${gameID}`;

    try {
      const currentGame = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );

      this.logger.verbose(currentGame);

      return JSON.parse(currentGame);
    } catch (e) {
      this.logger.error(`Failed to get gameID: ${gameID}`);
      throw new InternalServerErrorException(`Failed to get gameID: ${gameID}`);
    }
  }

  async addScore({ gameID, userID }: AddScoreData): Promise<Game> {
    this.logger.log(
      `Attempting to add a score for userID: ${userID} to gameID: ${gameID}`,
    );

    const key = `games:${gameID}`;
    const scorePath = `.scores.${userID}`;

    try {
      const game = await this.getGame(gameID);
      game.scores[userID] = (game.scores[userID] ?? 0) + 1;
      const score = game.scores[userID];

      await this.redisClient.send_command(
        'JSON.SET',
        key,
        scorePath,
        JSON.stringify(score),
      );

      this.logger.debug(`Current scores for gameID: ${gameID}`, game.scores);

      return game;
    } catch (e) {
      this.logger.error(
        `Failed to add a score for userID: ${userID} to gameID: ${gameID}`,
      );
      throw e;
    }
  }

  async addUser({ gameID, userID }: AddUserData): Promise<Game> {
    this.logger.log(
      `Attempting to add a user with userID: ${userID} to gameID: ${gameID}`,
    );

    const key = `games:${gameID}`;
    const usersPath = `.users.${userID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        usersPath,
        JSON.stringify(true),
      );

      const game = await this.getGame(gameID);

      this.logger.debug(
        `Current users for gameID: ${gameID}`,
        Object.keys(game.users).filter((k) => game.users[k]),
      );

      return game;
    } catch (e) {
      this.logger.error(
        `Failed to add a user with userID: ${userID} to gameID: ${gameID}`,
      );
      throw e;
    }
  }

  async removeUser({ gameID, userID }: RemoveUserData): Promise<Game> {
    this.logger.log(
      `Attempting to remove a user with userID: ${userID} from gameID: ${gameID}`,
    );

    const key = `games:${gameID}`;
    const usersPath = `.users.${userID}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        usersPath,
        JSON.stringify(false),
      );

      const game = await this.getGame(gameID);

      this.logger.debug(
        `Current users for gameID: ${gameID}`,
        Object.keys(game.users).filter((k) => game.users[k]),
      );

      return game;
    } catch (e) {
      this.logger.error(
        `Failed to remove a user with userID: ${userID} from gameID: ${gameID}`,
      );
      throw e;
    }
  }
}
