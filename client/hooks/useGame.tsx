import { useStore } from "@/store/app";
import { useEffect, useMemo } from "react";

export const useGame = () => {
  const { userID, gameID, scores, users, disconnect } = useStore((state) => ({
    userID: state.userID,
    gameID: state.game.id,
    scores: state.game.scores,
    users: state.game.users,
    disconnect: state.disconnect,
  }));

  const opponentID = useMemo(
    () =>
      Object.entries(users).filter(
        ([id, active]) => id !== userID && active
      )?.[0]?.[0],
    [users, userID]
  );
  const opponentScore = useMemo(
    () => scores[opponentID] || 0,
    [opponentID, scores]
  );
  const myScore = useMemo(() => scores[userID] || 0, [scores, userID]);

  return {
    userID,
    gameID,
    scores,
    users,
    disconnect,
    opponentID,
    opponentScore,
    myScore,
  };
};
