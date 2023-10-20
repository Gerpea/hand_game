import styled from "styled-components";
import { useTranslation } from "next-i18next";

const StyledContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

export default function MobilePage() {
  const { t } = useTranslation("common", { keyPrefix: "mobile" });

  return <StyledContainer>{t("notSupported")}</StyledContainer>;
}

export { getServerSideProps } from "@/utils/getServerSideLocale";
