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
  color: green;
`;

const StyledSlash = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 3px;
  box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25);
  background-color: #00020a;
  height: 100%;
  min-height: 100%;
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
