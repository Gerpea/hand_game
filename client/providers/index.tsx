"use client";

import { StyledComponentsRegistry } from "@/styles/registry";
import { GlobalStyles } from "@/styles/global";
import { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StyledComponentsRegistry>
      <GlobalStyles />
      {children}
    </StyledComponentsRegistry>
  );
};
