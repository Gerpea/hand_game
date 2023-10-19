import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { ControllerAuthGuard } from './controller-auth.guard';

@Controller()
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(private readonly gameService: GameService) {}

  @Post('token')
  async getToken() {
    const result = await this.gameService.getToken();

    return result;
  }

  @UseGuards(ControllerAuthGuard)
  @Post('create')
  async createGame() {
    const result = await this.gameService.createGame();

    return result;
  }
}
