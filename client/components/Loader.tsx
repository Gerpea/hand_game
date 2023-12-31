import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  12.5% {
    transform: rotate(90deg);
  }
  25% {
    transform: rotate(90deg);
  }
  37.5% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(180deg);
  }
  62.5% {
    transform: rotate(270deg);
  }
  75% {
    transform: rotate(270deg);
  }
  87.5% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const popout = keyframes`
  0% {
    transform: translate(0, 0);
  }
  12.5% {
    transform: translate(0, 0);
  }
  18.75% {
    transform: translate(0, -75%);
  }
  25% {
    transform: translate(0, 0);
  }
  62.5% {
    transform: translate(0, 0);
  }
  68.75% {
    transform: translate(0, -75%);
  }
  75% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, 0);
  }
`;

const StyledLoader = styled.div`
  width: 3rem;
  height: 3rem;
  position: relative;

  animation: ${rotate} 4s ease infinite;

  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;

    background-color: var(--card-color);
    border-radius: var(--card-border-radius);
  }

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;

    background-color: var(--card-color);
    border-radius: var(--card-border-radius);

    animation: ${popout} 4s ease infinite;
  }
`;

const Loader = () => {
  return <StyledLoader data-cy="loader" />;
};

export default Loader;
