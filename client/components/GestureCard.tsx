import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import Card from "./Card";
import { Gesture } from "@/types";

const StyledGestureCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: var(--card-color);
`;

type Props = {
  gesture: Gesture;
};

const GestureCard: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  gesture,
  ...props
}) => {
  return (
    <StyledGestureCard {...props}>
      <span>{gesture.label}</span>
    </StyledGestureCard>
  );
};

export default GestureCard;
