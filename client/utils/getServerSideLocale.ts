import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse } from "accept-language-parser";
import { GetServerSidePropsContext } from "next";
import { i18n } from "@/next-i18next.config";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const acceptLanguageHeader = context.req.headers["accept-language"];
  const preferedLanguage = acceptLanguageHeader ? parse(acceptLanguageHeader)[0].code : i18n.defaultLocale;

  return {
    props: {
      ...(await serverSideTranslations(preferedLanguage, ["common"]))
    }
  };
}
