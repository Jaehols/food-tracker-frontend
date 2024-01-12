import Head from "next/head";

import {api} from "~/utils/api";
import {type FoodDiaryEntry} from "~/server/api/routers/foodEntry";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {LoadingSpinner} from "~/components/loading";
import CreateEntryWizard from "~/components/entryWizard";
import React, {useContext, useEffect, useState} from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import {ThemeContext} from "~/components/ThemeContext";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
dayjs.extend(localizedFormat)

type ShortDiaryView_Props = {
    entry: FoodDiaryEntry,
}

const ShortDiaryView = ({entry}: ShortDiaryView_Props) => {
    const {theme} = useContext(ThemeContext);
    const [isVisible, setIsVisible] = useState(true);
    const {mutate} = api.foodDiary.deleteFoodDiaryEntry.useMutation()

    const { entryId, mealDescription, entryTime, additionalComments, kilojoules } = entry

    const handleDelete = () => {
        mutate({entryId});
        setIsVisible(false);
    };

    if (!isVisible) return <></>
    return (
        <div className={`flex gap-3 p-2 bg-${theme}-secondary bg-opacity-20 rounded-lg`}>
            <div className="flex flex-col w-full">
                <div className="flex gap-3 justify-between">
                    <div className={`font-bold text-${theme}-accentTwo`}>{mealDescription}</div>
                    <div className={`text-${theme}-accentOne`}>{dayjs(entryTime).format(`LT`)}</div>
                </div>
            <div>
                <div className={`text-${theme}-accentOne`}>{additionalComments}</div>
            </div>
            <div className="flex justify-between">
                    <div>
                        <div className={`text-${theme}-accentOne`}>Kilojoules: {kilojoules}</div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className={`p-2 rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`}
                    >
                        <TrashIcon className={`h-5 w-5 text-${theme}-primary`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

type DayView_Props = {
    entries: FoodDiaryEntry[],
    isLoading: boolean,
    date: Dayjs,
}

const DayView = ({ entries, isLoading, date }: DayView_Props) => {
    const {theme} = useContext(ThemeContext);

    const yesterday = dayjs().subtract(1, 'day')
    const today = dayjs()
    const tomorrow = dayjs().add(1, 'day')
    
    const dateMatchers = [
        {
            title: (d: Dayjs) => 'Yesterday',
            condition: (d: Dayjs) => d.isSame(yesterday, 'day')
        },
        {
            title: (d: Dayjs) => 'Today',
            condition: (d: Dayjs) => d.isSame(today, 'day')
        },
        {
            title: (d: Dayjs) => 'Tomorrow',
            condition: (d: Dayjs) => d.isSame(tomorrow, 'day')
        },
        {
            title: (d: Dayjs) => d.format('dddd, MMMM D'),
            condition: (d: Dayjs) => true
        }
    ]

    const { title } = dateMatchers.find(m => m.condition(date))!

    if (isLoading) return <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size={60}/>
    </div>

    const sortedEntries = [...entries].sort((a, b) => a.entryTime.localeCompare(b.entryTime));

    return (
        <div className="flex flex-col gap-4">
            <div className={`justify-center flex text-4xl text-${theme}-accentOne font-bold`}>{title(date)}</div>
            {sortedEntries.map((entry, index) => (
                <ShortDiaryView key={index} entry={entry}/>
            ))}
        </div>
    );
}

export default function Home() {
    const {theme} = useContext(ThemeContext);

    const [currentDate, setCurrentDate] = useState(dayjs());
    const startDate = currentDate.startOf('day')
    const endDate = currentDate.endOf('day')

    const {data: authorList, isLoading: fullListLoading, refetch } = api.foodDiary.getAllEntriesForUserInDateRange.useQuery({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')})

    const refetchData = () => void refetch();
    const ProgressOneDay = () => void setCurrentDate(prevDate => prevDate.clone().add(1, 'day'))
    const ProgressBackOneDay = () => void setCurrentDate(prevDate => prevDate.clone().subtract(1, 'day'))

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
                    <div className={`flex border-b border-${theme}-accentOne p-4 w-full bg`}>
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
                    </div>
                    <div className={`flex flex-col border-${theme}-accentOne`}>
                        <DayView
                            entries={authorList!}
                            isLoading={fullListLoading}
                            date={startDate}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
