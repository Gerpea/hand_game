import { Logger, NotAcceptableException, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket
} from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Namespace } from "socket.io";
import { SocketWithAuth } from "./types";
import { WsCatchAllFilter } from "src/exceptions/ws-catch-all-filter";

@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: "game"
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);
  constructor(private readonly gameServcie: GameService) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log("Websocket Gateway initialized");
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    const { gameID, userID } = client;

    if (!gameID || !userID) {
      return;
    }

    const roomName = gameID;

    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    const connectedClients = this.io.adapter.rooms.get(roomName)?.size ?? 0;
    if (connectedClients > 1) {
      client.emit("exception", new NotAcceptableException("Room is full already"));
      this.logger.debug(`Exception room is full`);
      return;
    }

    await client.join(roomName);

    this.logger.debug(`Socket connected with userID: ${userID}, gameID: ${gameID}"`);
    this.logger.log(`WS Client with id: ${client.id} connected`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.debug(`userID: ${userID} joined room with name: ${roomName}`);
    this.logger.debug(`Total clients connected to room '${roomName}': ${connectedClients}`);

    try {
      const updatedGame = await this.gameServcie.addUser({
        gameID: gameID,
        userID: userID
      });

      this.io.to(roomName).emit("user_connected", updatedGame, userID);
    } catch (e) {
      client.emit("exception", e);
    }

    client.on("disconnect", async () => {
      try {
        const updatedGame = await this.gameServcie.removeUser({
          gameID,
          userID
        });

        if (updatedGame) {
          this.io.to(roomName).emit("user_disconnected", updatedGame, userID);
        }
      } catch (e) {
        client.emit("exception", e);
      }
    });
  }

  async handleDisconnect() {
    const sockets = this.io.sockets;
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage("add_score")
  async addScore(@ConnectedSocket() client: SocketWithAuth) {
    const { gameID, userID } = client;

    this.logger.debug(`Attempting to add score for user ${userID} to game ${gameID}`);

    const updatedGame = await this.gameServcie.addScore({
      gameID: gameID,
      userID: userID
    });

    this.io.to(client.gameID).emit("score_added", updatedGame, userID);
  }
}
