import React, {useContext, useEffect, useState} from 'react';
import {api} from "~/utils/api";
import moment from 'moment-timezone';
import {ThemeContext} from "~/components/ThemeContext";
import { Dayjs } from 'dayjs';

type CreateEntryWizard_Props = {
    currentDate: Dayjs,
    onEntrySubmit: () => void,
}

const CreateEntryWizard = ({ currentDate, onEntrySubmit }: CreateEntryWizard_Props) => {
    const {theme, setTheme} = useContext(ThemeContext);
    const [entryTime, setEntryTime] = useState(currentDate.format('YYYY-MM-DDTHH:mm'));
    const [mealDescription, setMealDescription] = useState('');
    const [additionalComments, setAdditionalComments] = useState('');
    const [kilojoules, setKilojoules] = useState('');

    useEffect(() => {
        setEntryTime(currentDate.format('YYYY-MM-DDTHH:mm'));
    }, [currentDate]);

    const {mutate} = api.foodDiary.postFoodDiaryEntry.useMutation({
        onSuccess: () => {
            onEntrySubmit();
        },
    });
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const entryTimeInUtc = moment(entryTime).utc().format('YYYY-MM-DDTHH:mm');
        const input = {
            entryTime: entryTimeInUtc,
            mealDescription,
            additionalComments,
            kilojoules: Number(kilojoules)
        };

        mutate(input);
        setMealDescription('');
        setAdditionalComments('');
        setKilojoules('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-between gap-4">
                <div className="flex-1">
                    <input
                        placeholder="Meal Description"
                        value={mealDescription}
                        onChange={(e) => setMealDescription(e.target.value)}
                        className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne p-1`}
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="datetime-local"
                        value={entryTime}
                        onChange={(e) => setEntryTime(e.target.value)}
                        className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne p-1`}
                    />
                </div>
            </div>
            <div className="mt-4">
        <textarea
            placeholder="Additional Comments"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne p-1`}
            rows={4}
        ></textarea>
            </div>
            <div className="mt-4">
                <input
                    placeholder="Kilojoules"
                    value={kilojoules}
                    onChange={(e) => setKilojoules(e.target.value)}
                    className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne p-1`}
                    type="number"
                />
            </div>
            <div className="mt-4">
                <button type="submit" className={`bg-${theme}-secondary text-${theme}-accentTwo py-2 px-4 rounded`}>Submit Entry</button>
            </div>
        </form>
    );
};

export default CreateEntryWizard;
