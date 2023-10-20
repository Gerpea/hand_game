import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Providers } from "@/providers";

function MyApp({ Component, pageProps }: AppProps) {
  // setLocaleDict(localeDict);
  // console.log(locale);
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default appWithTranslation(MyApp);

// MyApp.getInitialProps = async (
//   context: AppContext
// ): Promise<AppInitialProps & AppOwnProps> => {
//   if(!context.ctx.res?.getHeader("lang")) {
//   console.log('ah vot ti suka', context)
//   }
//   const lang = (context.ctx.res?.getHeader("lang") || defaultLocale) as Locales;
//   console.log(new Date().toISOString(), localesDict[lang], lang, defaultLocale);
//   context.ctx.res?.removeHeader("lang");
//   const ctx = await App.getInitialProps(context);
//   const locale = (await localesDict[lang]()).default;

//   return {
//     ...ctx,
//     locale: lang,
//     localeDict: locale,
//   };
// };

// export default MyApp;
