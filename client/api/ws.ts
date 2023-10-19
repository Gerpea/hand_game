import { Game } from "@/types";
import { io } from "socket.io-client";
import { APIError, SocketWithActions } from "./types";

export const socketIOUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/${process.env.NEXT_PUBLIC_WS_GAME_NAMESPACE}`

type CreateSocketOptions = {
    accessToken: string;
    gameID: string;
    onConnect?: () => void;
    onError?: (error: APIError) => void;
    onUserConnected?: (game: Game, userID: string) => void;
    onUserDisconnected?: (game: Game, userID: string) => void;
    onScore?: (game: Game, userID: string) => void;
}


export const createSocketWithHandlers = ({
    accessToken,
    gameID,
    onConnect,
    onError,
    onUserConnected,
    onUserDisconnected,
    onScore
}: CreateSocketOptions): SocketWithActions => {
    const socket = <SocketWithActions>io(socketIOUrl, {
        auth: {
            token: accessToken,
            gameID,
        },
        transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
        onConnect?.();
    })

    socket.on('connect_error', () => {
        onError?.({
            message: "Unknown connection error",
            statusCode: 500
        });
    })

    socket.on('exception', (error) => {
        onError?.({
            message: error.message,
            statusCode: error.status
        });
    })

    socket.on('user_connected', (game: Game, userID: string) => {
        onUserConnected?.(game, userID)
    })

    socket.on('user_disconnected', (game: Game, userID: string) => {
        onUserDisconnected?.(game, userID)
    })

    socket.on('score_added', (game: Game, userID: string) => {
        onScore?.(game, userID)
    })

    socket.addScore = () => {
        socket.emit('add_score')
    }

    return socket
}