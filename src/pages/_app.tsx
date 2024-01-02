import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import React from "react";
import TopNavBar from "~/components/topNav";
import {ThemeProvider} from "~/components/ThemeProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <ClerkProvider {...pageProps}>
          <ThemeProvider>
              <TopNavBar />
              <Component {...pageProps} />
          </ThemeProvider>
      </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
