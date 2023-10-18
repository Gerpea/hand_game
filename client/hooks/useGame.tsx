import { useStore } from "@/store/app";

export const useGame = () => {
  return useStore((state) => ({
    userID: state.userID,
    gameID: state.game.id,
    scores: state.game.scores,
    users: state.game.users,
  }));
};
