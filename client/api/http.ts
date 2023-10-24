import { APIError, CreateGameResponse, JoinGameResponse } from "./types";

const baseApiUrl =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_API_HOST}${process.env.NEXT_PUBLIC_API_ENDPOINT}`
    : `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}${process.env.NEXT_PUBLIC_API_ENDPOINT}`;

type MakeRequestResponse<T> = {
  data: T | Record<string, never>;
  error?: APIError;
};

const makeRequest = async <T>(
  endpoint: string,
  reqInit?: RequestInit,
  accessToken?: string
): Promise<MakeRequestResponse<T>> => {
  try {
    const response = await fetch(`${baseApiUrl}${endpoint}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: accessToken } : {})
      },
      ...reqInit
    });

    const responseJSON = await response.json();

    if (!response.ok) {
      return {
        data: {},
        error: responseJSON as APIError
      };
    }

    return {
      data: responseJSON as T
    };
  } catch (e) {
    const error =
      e instanceof Error
        ? {
            message: process.env.NODE_ENV === "development" ? e.message : "Unknown error"
          }
        : {
            message: "Unknown error"
          };

    return {
      data: {},
      error
    };
  }
};

export const createGame = async (accessToken: string) => {
  return makeRequest<CreateGameResponse>(
    "/create",
    {
      method: "POST"
    },
    accessToken
  );
};

export const getToken = async () => {
  return makeRequest<JoinGameResponse>("/token", {
    method: "POST"
  });
};
