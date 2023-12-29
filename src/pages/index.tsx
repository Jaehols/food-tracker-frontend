import Head from "next/head";

import {api} from "~/utils/api";
import {FoodDiaryEntry} from "~/server/api/routers/foodEntry";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {LoadingSpinner} from "~/components/loading";
import CreateEntryWizard from "~/components/entryWizard";
import moment from 'moment-timezone';
import React, {useEffect, useState} from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
dayjs.extend(localizedFormat)


export default function Home() {
    const [currentDate, setCurrentDate] = useState(moment());
    const [forceRenderKey, setForceRenderKey] = useState(Date.now());

    const startDate = currentDate.clone().startOf('day').format('YYYY-MM-DD');
    const endDate = currentDate.clone().endOf('day').format('YYYY-MM-DD');
    const {data: authorList, isLoading: fullListLoading, refetch } = api.foodDiary.getAllEntriesForUserInDateRange.useQuery({startDate, endDate})

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
            <div className="flex gap-3 p-2 bg-secondary bg-opacity-20 rounded-lg">
                <div className="flex flex-col w-full">
                    <div className="flex gap-3 justify-between">
                        <div className="font-bold text-accentTwo">{props.entry.mealDescription}</div>
                        <div className="text-accentOne">{dayjs(props.entry.entryTime).format(`LT`)}</div>
                    </div>
                <div>
                    <div className="text-accentOne">{props.entry.additionalComments}</div>
                </div>
                <div className="flex justify-between">
                        <div>
                            <div className="text-accentOne">Kilojoules: {props.entry.kilojoules}</div>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-full bg-secondary hover:bg-accentOne focus:outline-none focus:ring-2 focus:ring-accentOne focus:ring-opacity-50"
                        >
                            <TrashIcon className="h-5 w-5 text-primary" />
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
                <div className="justify-center flex text-4xl text-accentOne font-bold">{title}</div>
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
            <main className="flex justify-center min-h-screen bg-primary">
                <div className=" w-full md:max-w-2xl h-full ">
                    <div className="flex border-b border-accentOne p-4 w-full bg" key={forceRenderKey}>
                        {<CreateEntryWizard onEntrySubmit={refetchData} currentDate={currentDate}/>}
                    </div>
                    <div className=" flex justify-between p-2">
                        <button onClick={ProgressBackOneDay} className="bg-secondary rounded-full p-2 text-accentTwo">&#8592;</button>
                        <button onClick={ProgressOneDay} className="bg-secondary rounded-full p-2 text-accentTwo">&#8594;</button>
                    </div>
                    <div className="flex flex-col border-accentOne">
                        <div><DayView entries={authorList!} isLoading={fullListLoading} date={moment(startDate).toDate()}/></div>
                    </div>
                </div>
            </main>
        </>
    );
}
