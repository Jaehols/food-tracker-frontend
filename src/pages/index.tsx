import Head from "next/head";

import {api} from "~/utils/api";
import {FoodDiaryEntry} from "~/server/api/routers/foodEntry";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {LoadingSpinner} from "~/components/loading";
import CreateEntryWizard from "~/components/entryWizard";
import moment from 'moment-timezone';
import React, {useContext, useEffect, useState} from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import {ThemeContext} from "~/pages/ThemeContext";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
dayjs.extend(localizedFormat)


export default function Home() {
    const {theme, setTheme} = useContext(ThemeContext);
    const [currentDate, setCurrentDate] = useState(moment());
    const [forceRenderKey, setForceRenderKey] = useState(Date.now());

    const startDate = currentDate.clone().startOf('day').format('YYYY-MM-DD');
    const endDate = currentDate.clone().endOf('day').format('YYYY-MM-DD');
    const {data: authorList, isLoading: fullListLoading, refetch } = api.foodDiary.getAllEntriesForUserInDateRange.useQuery({startDate, endDate})
    //const {data: settings, isLoading: settingsLoading} = api.userSettings.getUserSettings.useQuery();

    useEffect(() => {
        refetch();
    }, [startDate, endDate]);

    const refetchData = () => {
        refetch();
        setForceRenderKey(Date.now()); // Update the key to force re-render
    };


    const ShortDiaryView = (props: {
        entry: FoodDiaryEntry;
        key: number;
        }) => {

        const {mutate} = api.foodDiary.deleteFoodDiaryEntry.useMutation()
        const [isVisible, setIsVisible] = useState(true);

        const handleDelete = () => {
            mutate({entryId: props.entry.entryId});
            setIsVisible(false);
        };

        if (!isVisible) return null;

        return (
            <div className={`flex gap-3 p-2 bg-${theme}-secondary bg-opacity-20 rounded-lg`}>
                <div className="flex flex-col w-full">
                    <div className="flex gap-3 justify-between">
                        <div className={`font-bold text-${theme}-accentTwo`}>{props.entry.mealDescription}</div>
                        <div className={`text-${theme}-accentOne`}>{dayjs(props.entry.entryTime).format(`LT`)}</div>
                    </div>
                <div>
                    <div className={`text-${theme}-accentOne`}>{props.entry.additionalComments}</div>
                </div>
                <div className="flex justify-between">
                        <div>
                            <div className={`text-${theme}-accentOne`}>Kilojoules: {props.entry.kilojoules}</div>
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

    const DayView = ({ entries, isLoading, date }: { entries: FoodDiaryEntry[], isLoading: boolean, date: Date }) => {
        let title = dayjs(date).format('dddd, MMMM D');
        if(moment(date).isSame(moment(), 'day')) title = 'Today'
        if(moment(date).isSame(moment().subtract(1, 'day'), 'day')) title = 'Yesterday'
        if(moment(date).isSame(moment().add(1, 'day'), 'day')) title = 'Tomorrow'

        if (isLoading) return(
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size={60}/>
            </div>
        )

        const sortedEntries = [...entries].sort((a, b) => a.entryTime.localeCompare(b.entryTime));

        return (
            <div className="flex flex-col gap-4">
                <div className={`justify-center flex text-4xl text-${theme}-accentOne font-bold`}>{title}</div>
                {sortedEntries.map((entry, index) => (
                    <ShortDiaryView key={index} entry={entry}/>
                ))}
            </div>
        );
    }

    const ProgressOneDay = () => {
        setCurrentDate(prevDate => prevDate.clone().add(1, 'day'));
        refetch()
    }
    const ProgressBackOneDay = () => {
        setCurrentDate(prevDate => prevDate.clone().subtract(1, 'day'));
    };

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`flex justify-center min-h-screen bg-${theme}-primary`}>
                <div className=" w-full md:max-w-2xl h-full ">
                    <div className={`flex border-b border-${theme}-accentOne p-4 w-full bg`} key={forceRenderKey}>
                        {<CreateEntryWizard onEntrySubmit={refetchData} currentDate={currentDate}/>}
                    </div>
                    <div className=" flex justify-between p-2">
                        <button onClick={ProgressBackOneDay}
                                className={`p-2 rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`}>
                            <FaArrowLeft className={`h-5 w-5 text-${theme}-primary`}/>
                        </button>
                        <button onClick={ProgressOneDay}
                                className={`p-2 rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`}>
                            <FaArrowRight className={`h-5 w-5 text-${theme}-primary`}/>
                        </button>
                    </div>
                    <div className={`flex flex-col border-${theme}-accentOne`}>
                        <div><DayView entries={authorList!} isLoading={fullListLoading}
                                      date={moment(startDate).toDate()}/></div>
                    </div>
                </div>
            </main>
        </>
    );
}
