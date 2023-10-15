import { HTMLAttributes } from "react";
import { ModalBase, Props, StyledModalBody } from "./ModalBase";

export const OptionsModal: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  return (
    <ModalBase {...props}>
      <StyledModalBody>Share this code with your friend</StyledModalBody>
    </ModalBase>
  );
};
