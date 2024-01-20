import dayjs, { Dayjs } from "dayjs"
import { useContext, useEffect, useState } from "react"
import {api} from "~/utils/api"
import { ThemeContext } from "./ThemeContext"
import { LoadingSpinner } from "./Loading"
import { DiaryView } from "./DiaryView"
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa"
import EntryWizard from "./EntryWizard"
import { Button } from "./Button"

const getDateRenderProps = (date: Dayjs) => {
  const yesterday = dayjs().subtract(1, 'day')
  const today = dayjs()
  const tomorrow = dayjs().add(1, 'day')

  const dateMatchers = [
    {
      title: (d: Dayjs) => d.format('dddd, MMMM D'),
      subtitle: (d: Dayjs) => 'Yesterday',
      condition: (d: Dayjs) => d.isSame(yesterday, 'day')
    },
    {
      title: (d: Dayjs) => d.format('dddd, MMMM D'),
      subtitle: (d: Dayjs) => 'Today',
      condition: (d: Dayjs) => d.isSame(today, 'day')
    },
    {
      title: (d: Dayjs) => d.format('dddd, MMMM D'),
      subtitle: (d: Dayjs) => 'Tomorrow',
      condition: (d: Dayjs) => d.isSame(tomorrow, 'day')
    },
    {
      title: (d: Dayjs) => d.format('dddd, MMMM D'),
      subtitle: (d: Dayjs) => d.fromNow(),
      condition: (d: Dayjs) => d.isBefore(dayjs())
    },
    {
      title: (d: Dayjs) => d.format('dddd, MMMM D'),
      subtitle: (d: Dayjs) => d.fromNow(),
      condition: (d: Dayjs) => d.isAfter(dayjs())
    }
  ]

  const { condition, ...props } = dateMatchers.find(m => m.condition(date))!
  return props
}


type DayViewHeader_Props = {
  date: Dayjs,
  onChangeDay: (delta: number) => void,
}

const DayViewHeader = ({ date, onChangeDay }: DayViewHeader_Props) => {
  const {theme} = useContext(ThemeContext);
  const { title, subtitle } = getDateRenderProps(date)

  const isDateToday = date.isSame(dayjs(), 'day')

  return <div className="grid grid-cols-6 items-center">
    <button
      onClick={() => onChangeDay(-1)}
      className={`h-10 w-10 grid justify-items-center items-center rounded-full bg-${theme}-secondary hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50 justify-self-start`}
    >
      <FaArrowLeft className={`h-5 w-5 text-${theme}-primary`}/>
    </button>

    <div className={`text-center col-start-2 col-span-4`}>
      <h1 className={`text-xl text-${theme}-accentOne font-bold`}>{title(date)}</h1>
      <h2 className={`text-xl text-${theme}-secondary`}>{subtitle(date)}</h2>
    </div>

    <button
      disabled={isDateToday}
      onClick={() => onChangeDay(1)}
      className={`h-10 w-10 grid justify-items-center items-center rounded-full bg-${theme}-secondary ${isDateToday ? `opacity-50 cursor-not-allowed` : `hover:bg-${theme}-accentOne focus:outline-none focus:ring-2 focus:ring-${theme}-accentOne focus:ring-opacity-50`} justify-self-end`}
    >
      <FaArrowRight className={`h-5 w-5 text-${theme}-primary`}/>
    </button>

  </div>
}

type EntryWizardButton_Props = {
  date: Dayjs,
  onSubmit: () => void,
}

const EntryWizardButton = ({ date, onSubmit }: EntryWizardButton_Props) => {
  const { theme } = useContext(ThemeContext)
  const [ isEnabled, setEnabled ] = useState<boolean>(false)

  useEffect(() => {
    setEnabled(false)
  }, [date])

  const handleSubmit = () => {
    setEnabled(false)
    onSubmit()
  }

  return <div>
    {!isEnabled && <Button className={`w-full py-2 px-4 rounded`} onClick={() => setEnabled(true)}>
      <span>
        <FaPlus className={`inline -translate-y-0.5`} />
        &nbsp;
        New Entry
      </span>
    </Button>}
    {isEnabled && <div>
      <div className={`p-4 text-center bg-${theme}-secondary rounded-t-lg text-${theme}-primary`}>
        <span className='text-lg font-semibold'>New Entry</span>
      </div>
      <div className={`p-8 border-2 border-t-0 rounded-b-lg border-${theme}-secondary`}>
        <EntryWizard date={date} onSubmit={handleSubmit} onCancel={() => setEnabled(false)} />
      </div>
    </div>}
  </div>
}

export const DayView = () => {
  const [ date, setDate ] = useState<Dayjs>(dayjs())
  const [startDate, endDate] = [date.startOf('day'), date.endOf('day')]

  const {data, isLoading, refetch } = api.foodDiary.getAllEntriesForUserInDateRange.useQuery({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD')})

  const refetchData = () => void refetch()
  useEffect(refetchData, [startDate, endDate])

  if (isLoading) return <div className="flex justify-center items-center h-screen">
    <LoadingSpinner size={60}/>
  </div>

  const sortedEntries = !!data ? [...data].sort((a, b) => a.entryTime.localeCompare(b.entryTime)) : []

  return (
    <div className="flex flex-col gap-4 p-4">
      <DayViewHeader date={date} onChangeDay={(delta) => setDate(d => d.add(delta, 'days'))} />
      {sortedEntries.map((entry, index) => <DiaryView key={index} entry={entry}/>)}
      <EntryWizardButton date={date} onSubmit={refetchData} />
    </div>
  )
}
