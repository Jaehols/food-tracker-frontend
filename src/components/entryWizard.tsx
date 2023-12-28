import React, {useEffect, useState} from 'react';
import {api} from "~/utils/api";
import moment from 'moment-timezone';


const CreateEntryWizard = ({ currentDate, onEntrySubmit }: { currentDate: moment.Moment, onEntrySubmit: () => void }) => {

    const [entryTime, setEntryTime] = useState(currentDate.format('YYYY-MM-DDTHH:mm'));
    const [mealDescription, setMealDescription] = useState('');
    const [additionalComments, setAdditionalComments] = useState('');
    const [kilojoules, setKilojoules] = useState('');

    useEffect(() => {
        setEntryTime(currentDate.format('YYYY-MM-DDTHH:mm'));
    }, [currentDate]);

    const {mutate} = api.foodDiary.postFoodDiaryEntry.useMutation();
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
        setEntryTime(moment().format('YYYY-MM-DDTHH:mm'));
        setMealDescription('');
        setAdditionalComments('');
        setKilojoules('');
        onEntrySubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="datetime-local"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="bg-transparent w-full text-accentOne"
                />
            </div>
            <div>
                <input
                    placeholder="Meal Description"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                    className="bg-transparent w-full text-accentOne"
                />
            </div>
            <div>
                <input
                    placeholder="Additional Comments"
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    className="bg-transparent w-full text-accentOne"
                />
            </div>
            <div>
                <input
                    placeholder="Kilojoules"
                    value={kilojoules}
                    onChange={(e) => setKilojoules(e.target.value)}
                    className="bg-transparent w-full text-accentOne"
                    type="number"
                />
            </div>
            <div>
                <button type="submit" className="bg-secondary text-accentTwo py-2 px-4 rounded">Submit Entry</button>
            </div>
        </form>
    );
};

export default CreateEntryWizard;
