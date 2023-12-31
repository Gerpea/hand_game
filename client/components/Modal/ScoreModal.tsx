import { HTMLAttributes, useCallback, useMemo } from "react";
import { ModalBase, Props, StyledModalBody, StyledModalFooter, StyledModalTitle } from "./ModalBase";
import { useGame } from "@/hooks";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const StyledScores = styled.div`
  display: flex;
  justify-content: space-evenly;
  column-gap: 5rem;
  font-size: 2rem;
`;

const StyledScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
`;

const StyledDisconnectButton = styled.div`
  height: 3rem;
  width: calc(100% + 2rem);
  margin-left: -1rem;
  margin-right: -1rem;
  margin-bottom: -1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom-left-radius: var(--card-border-radius);
  border-bottom-right-radius: var(--card-border-radius);

  box-shadow: var(--box-shadow) inset;

  cursor: pointer;
  transition: all 0.15s linear;
  &:hover {
    box-shadow: 0px 0px 8px 8px rgba(34, 60, 80, 0.25) inset;
  }
`;

export const ScoreModal: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const { t } = useTranslation("common", { keyPrefix: "scoreModal" });

  const router = useRouter();
  const { disconnect, opponentScore, myScore } = useGame();

  const handleDisconnect = useCallback(async () => {
    disconnect();
    router.push("/");
  }, [router, disconnect]);

  return (
    <ModalBase {...props}>
      <StyledModalTitle>{t("title")}</StyledModalTitle>
      <StyledModalBody>
        <StyledScores>
          <StyledScore>
            <span>{t("you")}</span>
            <span>{myScore}</span>
          </StyledScore>
          <StyledScore>
            <span>{t("opponent")}</span>
            <span>{opponentScore}</span>
          </StyledScore>
        </StyledScores>
      </StyledModalBody>
      <StyledModalFooter>
        <StyledDisconnectButton onClick={handleDisconnect}>{t("disconnect")}</StyledDisconnectButton>
      </StyledModalFooter>
    </ModalBase>
  );
};
