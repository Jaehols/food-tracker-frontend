import React, {useContext, useEffect, useState} from 'react'
import {api} from "~/utils/api"
import {ThemeContext} from "~/components/ThemeContext"
import dayjs, { Dayjs } from 'dayjs'
import { Button } from './Button'

enum EnergyUnit {
  KILOJOULES = 'Kilojoules',
  CALORIES = 'Calories',
}
const defaultEnergyUnit = EnergyUnit.KILOJOULES

type CreateEntryWizard_Props = {
  date: Dayjs,
  onSubmit: () => void,
  onCancel: () => void,
}

const CreateEntryWizard = ({ date, onSubmit, onCancel }: CreateEntryWizard_Props) => {
  const {theme} = useContext(ThemeContext);
  const [entryTime, setEntryTime] = useState(date.format('HH:mm'));
  const [mealDescription, setMealDescription] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [energy, setEnergy] = useState('');
  const [unit, setUnit] = useState(defaultEnergyUnit);

  useEffect(() => {
      setEntryTime(date.format('HH:mm'));
  }, [date]);

  const {mutate} = api.foodDiary.postFoodDiaryEntry.useMutation({
    onSuccess: () => onSubmit(),
  });

  const reset = () => {
    setMealDescription('')
    setAdditionalComments('')
    setEnergy('');
    setUnit(defaultEnergyUnit)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const entryTimeAdjusted = dayjs(entryTime, 'HH:mm')
      .utc()
      .set('year', date.get('year'))
      .set('month', date.get('month'))
      .set('day', date.get('day'))
      .format('YYYY-MM-DDTHH:mm');
    const kilojoules = Number(energy) * (unit === EnergyUnit.CALORIES ? 4.184 : 1);
    const input = {
      entryTime: entryTimeAdjusted,
      mealDescription,
      additionalComments,
      kilojoules
    }
    mutate(input)
    reset()
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className={`text-${theme}-secondary`}>Description</label>
          <input
            name="description"
            placeholder="Burger and fries"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne placeholder:opacity-20 placeholder:italic p-1`}
          />
        </div>
        <div>
          <label className={`text-${theme}-secondary`}>Time</label>
          <input
            type="time"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne placeholder:opacity-20 placeholder:italic p-1`}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className={`text-${theme}-secondary`}>Additional Comments</label>
        <textarea
          placeholder="Tasted good but a seagull stole half of the meal"
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className={`bg-${theme}-accentTwo bg-opacity-20 rounded-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne placeholder:opacity-20 placeholder:italic p-1`}
          rows={4}
        />
      </div>
      <div className="mt-4">
        <label className={`text-${theme}-secondary`}>Energy</label>
        <div className="grid grid-cols-2">
          <div>
            <input
              placeholder="1000"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className={`bg-${theme}-accentTwo bg-opacity-20 rounded-l-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne placeholder:opacity-20 placeholder:italic p-1`}
              type="number"
            />
          </div>
          <select value={unit} onChange={(e) => setUnit(e.target.value as EnergyUnit)} className={`bg-${theme}-accentTwo bg-opacity-20 rounded-r-lg w-full text-${theme}-accentOne placeholder-${theme}-accentOne placeholder:opacity-20 placeholder:italic p-1`}>
            {Object.values(EnergyUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-8 flex gap-2 flex-row-reverse">
        <Button htmlType="submit" className={`py-2 px-4 rounded bg-${theme}-accentTwo`}>Submit</Button>
        <Button type="secondary" className={`py-2 px-4 rounded`} onClick={() => onCancel()}>Cancel</Button>
      </div>
    </form>
  );
};

export default CreateEntryWizard;
