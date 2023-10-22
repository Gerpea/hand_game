import { createGlobalStyle } from "styled-components";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin", "cyrillic"],
});

export const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;

  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #adfbff;
  color: var(--color);

  overflow: hidden;

  ${robotoMono.style}

  font-weight: bold;
  text-transform: uppercase;

  @media (min-width: 1920px) {
    font-size: 20px;
  }
}

:root {
  --card-color: #fe8033;
  --box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25);
  --color: #00020a;
  --score-color: green;
  --toast-color: rgba(254, 128, 51, 0.6);
  --card-border-radius: 8px;
}
`;
