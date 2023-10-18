import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { JoinGameDto } from './dtos';

@Controller()
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame() {
    const result = await this.gameService.createGame();

    return result;
  }

  @Post('join')
  async joinGame(@Body() joinGameDto: JoinGameDto) {
    const result = await this.gameService.joinGame(joinGameDto);

    return result;
  }
}
