import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledCard = styled.div`
  width: 416px;
  height: 416px;
  box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25);
  border-radius: 8px;
  overflow: hidden;
`;

const Card: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

export default Card;
