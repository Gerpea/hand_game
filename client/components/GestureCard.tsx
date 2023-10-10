import React from "react";
import styled from "styled-components";
import Card from "./Card";

const StyledGestureCard = styled(Card)`
  background-color: #ffe58b;

  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  gesture: string;
};

const GestureCard: React.FC<Props> = ({ gesture }) => {
  return (
    <StyledGestureCard>
      <span>{gesture}</span>
    </StyledGestureCard>
  );
};

export default GestureCard;
