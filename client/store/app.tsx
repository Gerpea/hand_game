import {
  SocketWithActions,
  createGame,
  createSocketWithHandlers,
  getToken,
} from "@/api";
import { Game } from "@/types";
import { toast } from "react-toastify";
import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { t } from "@/locales";

type State = {
  game: Game;
  userID: string;
  accessToken: string;
};

type Actions = {
  addScore: () => void;
  joinGame: (gameID: string) => void;
  createGame: () => Promise<string | undefined>;
  getToken: () => Promise<string | undefined>;
  disconnect: () => void;
};
const initialState: State = {
  game: {
    id: "",
    scores: {},
    users: {},
  },
  userID: "",
  accessToken: "",
};

const state: StateCreator<State & Actions, [], []> = (set, get) => {
  let socket: SocketWithActions | undefined;

  const createSocket = (accessToken: string, gameID: string) =>
    createSocketWithHandlers({
      accessToken,
      gameID,
      onScore(game) {
        set({ game });
      },
      onUserConnected(game, userID) {
        if (userID !== get().userID) {
          toast(t("toast.userConnected"));
        }
        set({ game });
      },
      onUserDisconnected(game, userID) {
        if (userID !== get().userID) {
          toast(t("toast.userDisconnected"));
        }
        set({ game });
      },
      async onError(error) {
        toast.error(error.message);
        if (error.statusCode === 404) {
          set({ game: initialState.game });
          await get().createGame();
          toast.error(t("toast.error.gameNotFound"));
          return;
        }
        if (error.statusCode === 401 || error.statusCode === 403) {
          await get().getToken();
          get().joinGame(get().game.id);
          toast(t("toast.error.tokenExpired"));
          return;
        }

        toast.error(error.message);
      },
    });

  return {
    ...initialState,
    addScore() {
      if (
        Object.values(get().game.users).filter((active) => active).length > 1
      ) {
        socket?.addScore();
      }
    },
    async getToken() {
      const { data, error } = await getToken();
      if (error) {
        toast.error(error.message);
        return;
      }

      set({ accessToken: data.accessToken, userID: data.userID });

      return data.accessToken;
    },
    async joinGame(gameID: string) {
      const accessToken = get().accessToken || (await get().getToken());
      if (!accessToken) {
        return;
      }

      socket?.disconnect();
      socket = createSocket(accessToken, gameID);
    },
    async createGame() {
      const accessToken = get().accessToken || (await get().getToken());
      if (!accessToken) {
        return;
      }

      const { data, error } = await createGame(accessToken);
      if (error) {
        if (error.statusCode === 403) {
          await get().getToken();
          return get().createGame();
        } else {
          toast.error(error.message);
        }
        return;
      }

      set({ game: data.game });

      return data.game.id;
    },
    disconnect() {
      set({ game: initialState.game });
    },
  };
};

export const useStore = create<State & Actions>()(
  devtools(
    persist(state, {
      name: "game-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        userID: state.userID,
      }),
    })
  )
);
