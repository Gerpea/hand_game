import { APIError, CreateGameResponse, JoinGameResponse } from "./types";

const baseApiUrl = `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`;

type MakeRequestResponse<T> = {
    data: T | Record<string, never>;
    error?: APIError;
}

const makeRequest = async <T>(
    endpoint: string,
    reqInit?: RequestInit
): Promise<MakeRequestResponse<T>> => {
    try {
        const response = await fetch(`${baseApiUrl}${endpoint}`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            ...reqInit,
        });

        const responseJSON = await response.json();

        if (!response.ok) {
            return {
                data: {},
                error: responseJSON as APIError,
            };
        }

        return {
            data: responseJSON as T,
        };
    } catch (e) {
        const error =
            e instanceof Error
                ? {
                    messages: [
                        process.env.NODE_ENV === 'development'
                            ? e.message
                            : 'Unknown error',
                    ],
                }
                : {
                    messages: ['Unknown error'],
                };

        return {
            data: {},
            error,
        };
    }
};

export const createGame = async () => {
    return makeRequest<CreateGameResponse>('/', {
        method: 'POST'
    })
}

export const joinGame = async (gameID: string) => {
    return makeRequest<JoinGameResponse>('/join', {
        method: 'POST',
        body: JSON.stringify({
            gameID
        })
    })
}
