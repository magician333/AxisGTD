'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, LapTimerIcon, Link2Icon, TokensIcon, TrashIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import MultipleSelector, { Option } from '@/components/ui/MultipleSelector';
import Footer from './Footer';
import Navbar from './Navbar';
import { LayoutClasses, TodoItem, TodoProps } from './interface';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';


function Todo({ index, todo, completedTODO, removeTODO, reviseTodo, addTag, tagOptions }: TodoProps) {

  return (
    <div className="shadow-md rounded bg-white mb-2 ml-1 mr-1" style={{ opacity: todo.completed ? '0.2' : "1" }}>
      <div className="w-full h-[1vh] rounded-t" style={{ backgroundColor: todo.completed ? '#39834A' : "#FF3333" }} >
      </div>
      <div className="flex items-center ml-3 mr-3 mt-2 mb-2 space-x-2">
        <Checkbox checked={todo.completed} onCheckedChange={() => completedTODO(index)} />
        <Textarea rows={3} cols={50} className="break-words max-h-20 max-w-200 border-none resize-none h-[3rem]" readOnly={todo.completed} value={todo.text} style={{ textDecoration: todo.completed ? 'line-through' : "" }} onChange={(e) =>
          reviseTodo(index, e.target.value)
        } />
      </div>
      <div className="ml-3 mr-3">
        <form>
          <MultipleSelector
            className="break-normal"
            options={tagOptions}
            value={todo.tags.map((item) => {
              return {
                label: item,
                value: item
              };
            })}
            creatable
            onChange={(e) => addTag(index, e.map((item)=>item.value))}
            placeholder="Select tags..."
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                no results found.
              </p>
            } />
        </form>
      </div>
      <Separator className="opacity-40" />
      <div className="flex items-center justify-between ml-3 mr-3 mt-2 mb-2 pb-2">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LapTimerIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Focus</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CalendarIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Deadline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link2Icon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Dependence</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TokensIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Subtasks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TrashIcon onClick={() => removeTODO(index)} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  );
}

const Home: React.FC = () => {

  const [TODOList, setTODOList] = useState<TodoItem[]>([]);
  const [displayCompleted,setDisplayCompleted] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [layoutType, setLayoutType] = useState<string>("axis");
  const [layoutModeClass, setlayoutModeClass] = useState<LayoutClasses>({
    boardGird: "grid-cols-2 grid-rows-2",
    boardSize: "w-[49.5vw] h-[44vh]",
    scrollareaHeight: "h-[36vh]",
    todoSize: "w-[23vw]",
    todoGrid: "grid-cols-2 grid-rows-2",
    colorbrandWidth: "w-[49.5vw]"
  });


  useEffect(() => {
    if (layoutType === "axis") {
      setlayoutModeClass({
        boardGird: "grid-cols-2 grid-rows-2",
        boardSize: "w-[49.5vw] h-[44vh]",
        scrollareaHeight: "h-[36vh]",
        todoSize: "w-[23vw]",
        todoGrid: "grid-cols-2 grid-rows-2",
        colorbrandWidth: "w-[49.5vw]"
      });
    } else if (layoutType === "kanban") {
      setlayoutModeClass({
        boardGird: "grid-cols-4 grid-rows-1",
        boardSize: "w-[24vw] h-[88vh]",
        scrollareaHeight: "h-[80vh]",
        todoSize: "w-[22vw]",
        todoGrid: "",
        colorbrandWidth: "w-[24vw]"
      });
    } else if (layoutType === "board") {
      setlayoutModeClass({
        boardGird: "grid-cols-1 grid-rows-4",
        boardSize: "w-[95vw] h-[90vh]",
        scrollareaHeight: "h-[80vh]",
        todoSize: "w-[23vw]",
        todoGrid: "grid-cols-4 grid-rows-1",
        colorbrandWidth: "w-[95vw]"
      });
    }
  }, [layoutType]);

  const AreaCard = [
    { level: 1, Title: "Important and Urgent", des: "Do it !", color: "bg-[#E03B3B]" },
    { level: 2, Title: "Important but Not Urgent", des: "Schedule it !", color: "bg-[#DD813C]" },
    { level: 3, Title: "Urgent but Not Important", des: "Eliminate it !", color: "bg-[#3C7EDD]" },
    { level: 4, Title: "Not Urgent and Not Important", des: "Delegate it !", color: "bg-[#848484]" },

  ]

  const [tagOptions, setTagOptions] = useState<Option[]>(
    [
      { label: 'Work', value: 'Work' },
      { label: 'Study', value: 'Study' },
      { label: 'Life', value: 'Life' },
      { label: 'Other', value: 'Other' }
    ]
  )

  const addTodo = (index:number,text: string, level: number) => {
    const data: TodoItem = { index:index,text: text, completed: false, level: level, tags: [],completedtime:0 };
    const newTodoList = [...TODOList, data];
    setTODOList(newTodoList);
    localStorage.setItem("TODOList", JSON.stringify(newTodoList))
  };

  const reviseTodo = (index: number, text: string) => {
    const newTodoList = [...TODOList];
    newTodoList[index].text = text
    setTODOList(newTodoList);
    localStorage.setItem("TODOList", JSON.stringify(newTodoList))

  }

  const completedTODO = (index: number) => {
    const newTodoList = [...TODOList];

    if (newTodoList[index].completed===false){
      newTodoList[index].completedtime = Date.now();
    }
    // new Notification("Todo is complete!",{body:"completed",icon:"/logo.svg"})
    newTodoList[index].completed = !newTodoList[index].completed;
    setTODOList(newTodoList);
    localStorage.setItem("TODOList", JSON.stringify(newTodoList))
  };

  const removeTODO = (index: number) => {
    const newTodoList = [...TODOList];
    newTodoList.splice(index, 1);
    setTODOList(newTodoList);
    localStorage.setItem("TODOList", JSON.stringify(newTodoList))
  };

  const addTag = (index: number, tags: string[]) => {
    const newTodoList = [...TODOList];
    newTodoList[index].tags = tags;
    setTODOList(newTodoList);
    localStorage.setItem("TODOList", JSON.stringify(newTodoList))
  }




  useEffect(() => {
    const loadFromStorage = () => {
      const storedData = localStorage.getItem("TODOList");
      let parsedData: TodoItem[] = [];
      if (storedData !== null) {
        try {
          parsedData = JSON.parse(storedData);
        } catch (error) {
          console.error("Failed to parse localStorage data:", error);
        }
      }
      return parsedData;
    };

    const todoItemsFromStorage = loadFromStorage();

    if (JSON.stringify(todoItemsFromStorage) !== JSON.stringify(TODOList)) {
      setTODOList(todoItemsFromStorage);
    }
  }, [TODOList]);

  return (
    <>
      <div className='absolute z-10'>
        <Navbar addTodo={addTodo} TodoList={TODOList} setTODOList={setTODOList} setSearchText={setSearchText} setLayoutType={setLayoutType} layoutType={layoutType} setDisplayCompleted={setDisplayCompleted} displayCompleted={displayCompleted}/>
      </div>
      <div className={layoutModeClass.boardGird + " grid justify-items-center pt-16 "}>
        {
          AreaCard.map((item, index) => (
            <div key={index} className={layoutModeClass.boardSize + " grid m-1 rounded shadow-md"}>
              <div className={item.color + " " + layoutModeClass.colorbrandWidth + " h-[5vh] rounded-t "}>
                <div className=" ml-3 mb-1 rounded -z-10 flex items-center justify-between">
                  <div className="flex justify-center flex-col mt-1">
                    <p className=" text-white text-l font-semibold">{item.Title}</p>
                    <p className=" text-white text-xs font-light">{item.des}</p>
                  </div>
                </div>
              </div>
              <ScrollArea className={layoutModeClass.scrollareaHeight + " rounded"}>
                <div className={layoutModeClass.todoGrid + " grid mt-2 ml-2 mr-2 mb-2 justify-items-center"}>
                  {
                    TODOList.map((todo, index) => {
                      const hasSearchText = todo.text.indexOf(searchText) !== -1 || todo.tags.indexOf(searchText) !== -1;
                      if (displayCompleted){

                        if (todo.level === item.level) {
                        if (hasSearchText) {
                              return <div className={layoutModeClass.todoSize} key={index}><Todo key={index} todo={todo} index={index} completedTODO={completedTODO} removeTODO={removeTODO} reviseTodo={reviseTodo} addTag={addTag} tagOptions={tagOptions}></Todo></div>
                        }
                      }
                      }else{
                        if (todo.completed === false){

                        if (todo.level === item.level) {
                        if (hasSearchText) {
                              return <div className={layoutModeClass.todoSize} key={index}><Todo key={index} todo={todo} index={index} completedTODO={completedTODO} removeTODO={removeTODO} reviseTodo={reviseTodo} addTag={addTag} tagOptions={tagOptions}></Todo></div>
                        }
                      }
                        }
                      }
                    })
                  }
                </div>
              </ScrollArea>
              <p className="text-gray-300 text-xs mr-5 flex justify-end">Total {TODOList.filter((todo) => todo.level === item.level).length} Task(s). Completed {TODOList.filter((todo) => todo.level === item.level && todo.completed === true).length} Task(s)</p>
            </div>
          ))
        }
      </div>
      <Footer />
      <Toaster />
    </>
  );
}

export default Home;
