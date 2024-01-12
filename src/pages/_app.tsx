import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { Inter } from 'next/font/google'

import "~/styles/globals.css";
import React from "react";
import TopNavBar from "~/components/topNav";
import {ThemeProvider} from "~/components/ThemeProvider";

const inter = Inter({ subsets: ['latin'] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider>
        <div className={inter.className}>
          <nav>
            <TopNavBar />
          </nav>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
