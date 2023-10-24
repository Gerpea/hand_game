import { Game } from "@/types";
import { Socket } from "socket.io-client";

export type APIError = {
  message: string;
  statusCode?: number;
};

export type CreateGameResponse = {
  accessToken: string;
  userID: string;
  game: Game;
};

export type JoinGameResponse = {
  accessToken: string;
  userID: string;
  game: Game;
};

export type JTWPayload = {
  gameID: string;
  sub: string;
};

export type SocketWithActions = Socket & {
  addScore: () => void;
};
