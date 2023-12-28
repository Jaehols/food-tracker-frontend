import React, { useState } from 'react';
import {api} from "~/utils/api";

const CreateEntryWizard = () => {
    const [entryTime, setEntryTime] = useState('');
    const [mealDescription, setMealDescription] = useState('');
    const [additionalComments, setAdditionalComments] = useState('');
    const [kilojoules, setKilojoules] = useState('');

    const {mutate} = api.foodDiary.postFoodDiaryEntry.useMutation();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const input = {
            entryTime,
            mealDescription,
            additionalComments,
            kilojoules: Number(kilojoules)
        };
        mutate(input);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="datetime-local"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="bg-transparent w-full"
                />
            </div>
            <div>
                <input
                    placeholder="Meal Description"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                    className="bg-transparent w-full"
                />
            </div>
            <div>
                <input
                    placeholder="Additional Comments"
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    className="bg-transparent w-full"
                />
            </div>
            <div>
                <input
                    placeholder="Kilojoules"
                    value={kilojoules}
                    onChange={(e) => setKilojoules(e.target.value)}
                    className="bg-transparent w-full"
                    type="number"
                />
            </div>
            <div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit Entry</button>
            </div>
        </form>
    );
};

export default CreateEntryWizard;
