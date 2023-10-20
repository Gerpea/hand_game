import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import { Providers } from "@/providers";
import {
  I18nProvider,
  Locale,
  getLocaleProps,
  localesDict,
  setLocaleDict,
  Locales,
  defaultLocale,
} from "@/locales";

type AppOwnProps = {
  locale: Locale;
};

function MyApp({ Component, locale, pageProps }: AppProps & AppOwnProps) {
  setLocaleDict(locale);
  return (
    <Providers>
      <I18nProvider locale={locale}>
        <Component {...pageProps} />
      </I18nProvider>
    </Providers>
  );
}

MyApp.getInitialProps = getLocaleProps<
  AppContext,
  //@ts-ignore
  AppInitialProps & AppOwnProps
>(async (context: AppContext): Promise<AppInitialProps & AppOwnProps> => {
  const lang = (context.ctx.res?.getHeader("lang") || defaultLocale) as Locales;
  context.ctx.res?.removeHeader("lang");
  const ctx = await App.getInitialProps(context);
  const locale = (await localesDict[lang]()).default;

  return {
    ...ctx,
    locale,
  };
});

export default MyApp;
