import { useStore } from "@/store/app";

export const useApi = () => {
  return useStore((state) => ({
    addScore: state.addScore,
    createGame: state.createGame,
    joinGame: state.joinGame
  }));
};
