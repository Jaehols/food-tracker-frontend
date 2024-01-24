import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Inter } from 'next/font/google'

import "~/styles/globals.css";
import React from "react";
import TopNavBar from "~/components/TopNav";
import {ThemeProvider} from "~/components/ThemeProvider";
import UserSettingsProvider from "~/components/UserSettingsProvider";

const inter = Inter({ subsets: ['latin'] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <ClerkProvider {...pageProps}>
          <UserSettingsProvider>
              <ThemeProvider>
                  <div className={inter.className}>
                      <TopNavBar/>
                      <Component {...pageProps} />
                  </div>
              </ThemeProvider>
          </UserSettingsProvider>
      </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
