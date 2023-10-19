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
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #adfbff;
  color: #00020a;

  ${robotoMono.style}

  font-weight: bold;
  text-transform: uppercase;
}
`;
