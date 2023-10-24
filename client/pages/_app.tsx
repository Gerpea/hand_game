import { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Providers } from "@/providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default appWithTranslation(MyApp);
