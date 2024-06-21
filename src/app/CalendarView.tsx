import { Button } from "@/components/ui/button";
import { DotFilledIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, ResetIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { CalendarViewProps } from "./Interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodoOverview from "./TodoOverView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TodoColor } from "./DeafultProps";

export default function CalendarView({ TodoList, lang }: CalendarViewProps) {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now()));
  const daysOfWeek: string[] = lang["calendar_week"].map((item: string) => item)
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const createdTimeList: string[] = TodoList.map((item) => new Date(item.createdtime).toDateString());
  const completedTimeList = TodoList.map((item) => new Date(item.completedtime).toDateString());
  const deadlineTimeList = TodoList.map((item) => new Date(item.deadline === "" ? null : JSON.parse(item.deadline)).toDateString());

  const handlePreviousMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelectedDate(newDate)
  }

  const displayDot = (TList: string[], checkDay: Date) => {
    return TList.includes(checkDay.toDateString());
  }

  return (
    <>
      <div className="flex space-x-10 h-[40vh] items-start justify-center">
        <div className="space-y-2 flex flex-col items-center">
          <div className="flex justify-between w-[19vw] items-center">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}><DoubleArrowLeftIcon /></Button>
            <div className="font-semibold">
              {date.getFullYear() + "-" + (date.getMonth() + 1)}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}><DoubleArrowRightIcon /></Button>
          </div>
          <table className="flex flex-col w-[20vw]">
            <thead>
              <tr className="grid gap-2 grid-cols-7">
                {daysOfWeek.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="grid gap-2 grid-cols-7">
              {Array.from({ length: startDayOfWeek }, (_, i) => null).map((day, index) => (
                <tr key={index}>
                  <td />
                </tr>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day, index) => {
                const currentDay = new Date(date.getFullYear(), date.getMonth(), day);
                return (
                  <tr key={index} className="flex items-center justify-center rounded hover:bg-zinc-100 space-x-2 pt-1"
                    style={{
                      backgroundColor: selectedDate.toDateString() === currentDay.toDateString() ? "#09090b" : "",
                      color: selectedDate.toDateString() === currentDay.toDateString()
                        ? "#FFFFFF" : "",
                    }}
                  >
                    <td className="flex flex-col space-y-0" onClick={() => { handleDateClick(day) }}>
                      <p className="text-center font-medium">{day}</p>
                      <div className="flex h-4 items-center justify-center">
                        {displayDot(createdTimeList, currentDay)
                          ? <div className="text-TodoUnCompleted"><DotFilledIcon className="size-3" /></div> : <div></div>}
                        {displayDot(completedTimeList, currentDay)
                          ? <div className="text-TodoCompleted"><DotFilledIcon className="size-3" /> </div> : <div></div>}
                        {displayDot(deadlineTimeList, currentDay)
                          ? <div className="text-TodoDeadline"><DotFilledIcon className="size-3" /></div> : <div></div>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="absolute bottom-5">
            <div className="flex space-x-3 items-baseline w-full">
              <div className="text-TodoUnCompleted flex items-center">
                <DotFilledIcon className="size-3" />
                <p className="text-xs font-semibold">{lang["calendar_tab1"]}</p>
              </div>
              <div className="text-TodoCompleted flex items-center">
                <DotFilledIcon className="size-3" />
                <p className="text-xs font-semibold">{lang["calendar_tab2"]}</p>
              </div>
              <div className="text-TodoDeadline flex items-center">
                <DotFilledIcon className="size-3" />
                <p className="text-xs font-semibold">{lang["calendar_tab3"]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[40vw]">
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="created">{lang["calendar_tab1"]}</TabsTrigger>
              <TabsTrigger value="completed">{lang["calendar_tab2"]}</TabsTrigger>
              <TabsTrigger value="deadline">{lang["calendar_tab3"]}</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="w-full">
              <ScrollArea className="h-[35vh]">
                {
                  TodoList.map((item, index) => {
                    if (new Date(item.createdtime).toDateString() === selectedDate.toDateString()) {
                      return (
                        <div className="w-[39vw]" key={index}><TodoOverview item={item} lang={lang} /></div>
                      )
                    }
                  })
                }
              </ScrollArea>
            </TabsContent>

            <TabsContent value="completed">
              <ScrollArea className="h-[35vh] w-full">
                {
                  TodoList.map((item, index) => {
                    if (new Date(item.completedtime).toDateString() === selectedDate.toDateString()) {
                      return (
                        <div className="w-[39vw]" key={index}><TodoOverview item={item} lang={lang} /></div>
                      )
                    }
                  })
                }
              </ScrollArea>
            </TabsContent>

            <TabsContent value="deadline">
              <ScrollArea className="h-[35vh] w-full">
                {
                  TodoList.map((item, index) => {
                    if (new Date(item.deadline === "" ? null : JSON.parse(item.deadline)).toDateString() === selectedDate.toDateString()) {
                      return (
                        <div className="w-[39vw]" key={index}><TodoOverview item={item} lang={lang} /></div>
                      )
                    }
                  })
                }
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </>
  )
}
