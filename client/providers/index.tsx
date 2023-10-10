"use client";

import { StyledComponentsRegistry } from "@/styles/registry";
import { GlobalStyles } from "@/styles/global";

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <StyledComponentsRegistry>
      <GlobalStyles />
      {props.children}
    </StyledComponentsRegistry>
  );
};
