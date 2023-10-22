import React, { forwardRef } from "react";
import styled from "styled-components";

const StyledCard = styled.div`
  width: 416px;
  height: 416px;

  box-shadow: var(--box-shadow);
  border-radius: var(--card-border-radius);
  
  overflow: hidden;
`;

const Card = forwardRef<
  React.HTMLAttributes<HTMLDivElement>,
  React.HTMLAttributes<HTMLDivElement>
>(function Card({ children, ...props }, ref) {
  return (
    <StyledCard {...props} ref={ref as any}>
      {children}
    </StyledCard>
  );
});

export default Card;
