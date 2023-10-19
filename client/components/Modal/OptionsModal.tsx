import { HTMLAttributes, useCallback, useMemo } from "react";
import { BiCopy } from "react-icons/bi";
import {
  ModalBase,
  Props,
  StyledModalBody,
  StyledModalTitle,
} from "./ModalBase";
import { useGame } from "@/hooks";
import styled from "styled-components";
import { copyTextToClipboard } from "@/utils";
import { toast } from "react-toastify";

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
  const { gameID } = useGame();

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
      <StyledModalTitle>Share this code with your friend</StyledModalTitle>
      <StyledModalBody>
        <StyledShareURL onClick={handleCopyToClipboard}>
          <h3>{shareURL}</h3>
          <StyledShareIcon />
        </StyledShareURL>
      </StyledModalBody>
    </ModalBase>
  );
};
