import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GameModule } from "./game/game.module";

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? ".env" : `.env.${ENV}`
    }),
    GameModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
