import { Length, IsString } from "class-validator";

export class JoinGameDto {
  @IsString()
  @Length(6, 6)
  gameID: string;
}
