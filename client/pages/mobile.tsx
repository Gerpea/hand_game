import { useScopedI18n } from "@/locales";
import styled from "styled-components";

const StyledContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const MobilePage = () => {
  const t = useScopedI18n("mobile");

  return (
    <StyledContainer>
      {t('notSupported')}
    </StyledContainer>
  );
};

export default MobilePage;
