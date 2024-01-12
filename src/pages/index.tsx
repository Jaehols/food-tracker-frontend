import Head from "next/head";

import {api} from "~/utils/api";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc'
import customParseFormat from "dayjs/plugin/customParseFormat";
import CreateEntryWizard from "~/components/EntryWizard";
import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "~/components/ThemeContext";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import { DayView } from "~/components/DayView";

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(customParseFormat)

export default function Home() {
    const {theme} = useContext(ThemeContext);

    const [currentDate, setCurrentDate] = useState(dayjs());
    const startDate = currentDate.startOf('day')
    const endDate = currentDate.endOf('day')

    const {data: authorList, isLoading: fullListLoading, refetch } = api.foodDiary.getAllEntriesForUserInDateRange.useQuery({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')})

    const refetchData = () => void refetch();
    useEffect(refetchData, [startDate, endDate]);

    return (
        <>
            <Head>
                <title>Food Tracker</title>
                <meta name="description" content="Track your food intake"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`flex justify-center min-h-screen bg-${theme}-primary`}>
                <div className="w-full md:max-w-2xl h-full ">
                    {/* <div className={`flex border-b border-${theme}-accentOne p-4 w-full bg`}>
                        <CreateEntryWizard onEntrySubmit={refetchData} currentDate={currentDate} />
                    </div>
                    <div className=" flex justify-between p-2">
                        <button
                            onClick={ProgressBackOneDay}
                            className={`p-2 rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`}
                        >
                            <FaArrowLeft className={`h-5 w-5 text-${theme}-primary`}/>
                        </button>
                        <button
                            onClick={ProgressOneDay}
                            className={`p-2 rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`}
                        >
                            <FaArrowRight className={`h-5 w-5 text-${theme}-primary`}/>
                        </button>
                    </div> */}
                    <div className={`flex flex-col border-${theme}-accentOne`}>
                        <DayView
                            entries={authorList!}
                            isLoading={fullListLoading}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
