import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import Card from "./Card";
import { Gesture } from "@/types";
import GestureImage from "./GestureImage";

const StyledGestureCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--card-color);

  position: relative;
`;

const StyledGestureImage = styled(GestureImage)`
  padding: 2rem;
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
      <StyledGestureImage gesture={gesture} />
    </StyledGestureCard>
  );
};

export default GestureCard;
