import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import React from "react";
import TopNavBar from "~/components/topNav";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <ClerkProvider {...pageProps}>
          <TopNavBar />
          <Component {...pageProps} />
      </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
