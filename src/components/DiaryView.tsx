import { useContext, useState } from "react"
import { FoodDiaryEntry } from "~/server/api/routers/foodEntry"
import { ThemeContext } from "./ThemeContext"
import { api } from "~/utils/api"
import dayjs from "dayjs"
import { TrashIcon } from '@heroicons/react/24/outline'

type DiaryView_Props = {
  entry: FoodDiaryEntry,
}

export const DiaryView = ({entry}: DiaryView_Props) => {
  const {theme} = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true)
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
