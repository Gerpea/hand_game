import { HTMLAttributes, useCallback } from "react";
import { BiCopy } from "react-icons/bi";
import {
  ModalBase,
  Props,
  StyledModalBody,
  StyledModalTitle,
} from "./ModalBase";
import styled from "styled-components";
import { copyTextToClipboard } from "@/utils";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "next-i18next";

const StyledShareURL = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  cursor: pointer;

  * {
    padding: 0;
    margin: 0;
  }

  &:hover {
    opacity: 0.5;
  }
`;

const StyledShareIcon = styled(BiCopy)`
  width: 1.5rem;
  height: 1.5rem;
`;

export const OptionsModal: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const { t } = useTranslation("common", { keyPrefix: "optionsModal" });
  const shareURL = `${typeof window !== "undefined" && window?.location?.href}`;

  const handleCopyToClipboard = useCallback(() => {
    copyTextToClipboard(shareURL);
    toast.success(
      <Trans values={{ subj: shareURL }} components={{ bold: <b /> }}>
        {t("copiedToClipboard")}
      </Trans>
    );
  }, [shareURL, t]);

  return (
    <ModalBase {...props}>
      <StyledModalTitle>{t("title")}</StyledModalTitle>
      <StyledModalBody>
        <StyledShareURL onClick={handleCopyToClipboard}>
          <h3>{shareURL}</h3>
          <StyledShareIcon />
        </StyledShareURL>
      </StyledModalBody>
    </ModalBase>
  );
};
