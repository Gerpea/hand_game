import { useGame } from "@/hooks";
import { useMemo } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  padding: 0.5rem;
  column-gap: 1rem;
`;

const StyledMyScore = styled.span`
  color: var(--score-color);
`;

const StyledSlash = styled.span`
  width: 0.1875rem;
  height: 100%;
  min-height: 100%;

  position: absolute;
  left: 0;
  right: 0;

  margin: auto;

  box-shadow: var(--box-shadow);
  background-color: var(--color);
`;

const StyledOpponentScore = styled.span`
`;

const Score = () => {
  const { users, scores, userID } = useGame();
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

  return (
    <StyledContainer>
      <StyledMyScore>{myScore}</StyledMyScore>
      <StyledSlash />
      <StyledOpponentScore>{opponentScore}</StyledOpponentScore>
    </StyledContainer>
  );
};

export default Score;
