import { useRouter } from "next/router";
import { useEffect } from "react";
import { useApi } from ".";

export const useGameRedirects = (gameID: string) => {
  const { query, isReady, push: routerPush } = useRouter();
  const { createGame, joinGame } = useApi();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (gameID && gameID !== query["id"]) {
      routerPush(gameID);
    }
  }, [routerPush, query, isReady, gameID]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (query["id"]) {
      joinGame(query["id"] as string);
      return;
    }

    if (!query["id"]) {
      (async () => {
        const gameID = await createGame();
        if (gameID) {
          routerPush(`/${gameID}`);
        }
      })();
    }
  }, [routerPush, query, isReady, joinGame, createGame]);
};
