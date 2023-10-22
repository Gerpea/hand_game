import { keyframes } from "styled-components";

export const zoomIn = (withShadow: boolean) => keyframes`
  0% {
    box-shadow: none;
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  75% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    ${withShadow ? "box-shadow: var(--box-shadow);" : ""}
    transform: scale(1);
    opacity: 1;
  }
`;

export const zoomOut = () => keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
`;
