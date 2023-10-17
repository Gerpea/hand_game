import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtModule, redisModule } from 'src/modules.config';
import { GameGateway } from './game.gateway';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [ConfigModule, redisModule, jwtModule],
  controllers: [GameController],
  providers: [GameService, GameRepository, GameGateway],
})
export class GameModule {}
