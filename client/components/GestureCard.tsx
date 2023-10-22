import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import Card from "./Card";
import { Gesture } from "@/types";
import Image from "next/image";

const StyledGestureCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--card-color);

  position: relative;
`;

const StyledImage = styled(Image)`
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
      <StyledImage
        src={gesture.img}
        alt={gesture.label}
        layout="fill"
        objectFit="contain"
      />
    </StyledGestureCard>
  );
};

export default GestureCard;
