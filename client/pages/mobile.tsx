import styled from "styled-components";

const StyledContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const MobilePage = () => {
  return (
    <StyledContainer>
      Sorry, but currently we do not support any of mobile or tablet devices, please open
      this page on desktop
    </StyledContainer>
  );
};

export default MobilePage;
