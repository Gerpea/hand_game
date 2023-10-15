import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import Card from "./Card";
import { Gesture } from "@/types";

const StyledGestureCard = styled(Card)`
  background-color: #ffe58b;

  display: flex;
  align-items: center;
  justify-content: center;
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
