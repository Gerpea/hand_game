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
import { useScopedI18n } from "@/locales";

const StyledShareURL = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  column-gap: 0.25rem;

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
  const t = useScopedI18n("optionsModal");

  const shareURL = `${typeof window !== "undefined" && window?.location?.href}`;

  const handleCopyToClipboard = useCallback(() => {
    copyTextToClipboard(shareURL);
    toast.success(
      <span>
        Copied <b>{shareURL}</b> to clipboard
      </span>
    );
  }, [shareURL]);

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
