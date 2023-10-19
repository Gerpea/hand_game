import { HTMLAttributes, useCallback, useMemo } from "react";
import { BiCopy } from "react-icons/bi";
import {
  ModalBase,
  Props,
  StyledModalBody,
  StyledModalFooter,
  StyledModalTitle,
} from "./ModalBase";
import { useGame } from "@/hooks";
import styled from "styled-components";
import { useRouter } from "next/router";

const StyledScores = styled.div`
  display: flex;
  justify-content: space-evenly;
  column-gap: 5rem;
  font-size: 2rem;
`;

const StyledScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
`;

const StyledDisconnectButton = styled.div`
  height: 3rem;
  width: calc(100% + 2rem);
  margin-left: -1rem;
  margin-right: -1rem;
  margin-bottom: -1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25) inset;

  cursor: pointer;
  transition: all 0.15s linear;
  &:hover {
    box-shadow: 0px 0px 8px 8px rgba(34, 60, 80, 0.25) inset;
  }
`;

export const ScoreModal: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const router = useRouter();
  const { users, scores, userID, disconnect } = useGame();
  const myScore = useMemo(() => scores[userID] || 0, [scores, userID]);
  const opponentScore = useMemo(
    () =>
      scores[
        Object.entries(users).filter(
          ([id, active]) => id !== userID && active
        )[0][0]
      ] || 0,
    [scores, userID, users]
  );

  const handleDisconnect = useCallback(async () => {
    disconnect();
    router.push("/");
  }, [router, disconnect]);

  return (
    <ModalBase {...props}>
      <StyledModalTitle>Score Board</StyledModalTitle>
      <StyledModalBody>
        <StyledScores>
          <StyledScore>
            <span>YOU</span>
            <span>{myScore}</span>
          </StyledScore>
          <StyledScore>
            <span>OPPONENT</span>
            <span>{opponentScore}</span>
          </StyledScore>
        </StyledScores>
      </StyledModalBody>
      <StyledModalFooter>
        <StyledDisconnectButton onClick={handleDisconnect}>
          Disconnect
        </StyledDisconnectButton>
      </StyledModalFooter>
    </ModalBase>
  );
};
