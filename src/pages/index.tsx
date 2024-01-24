import Head from "next/head"
import dayjs from "dayjs"
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import customParseFormat from "dayjs/plugin/customParseFormat"
import React, {useContext} from "react"
import {ThemeContext} from "~/components/ThemeContext"
import { DayView } from "~/components/DayView"

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(customParseFormat)

export default function Home() {
    const {theme} = useContext(ThemeContext);

    return <>
      <Head>
        <title>Food Tracker</title>
        <meta name="description" content="Track your food intake"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main className={`flex justify-center min-h-screen bg-${theme}-primary`}>
        <div className="w-full md:max-w-2xl h-full ">
          <div className={`flex flex-col border-${theme}-accentOne`}>
            <DayView />
          </div>
        </div>
      </main>
    </>
}
