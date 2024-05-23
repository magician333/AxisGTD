'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { Option } from '@/components/ui/MultipleSelector';
import Footer from './Footer';
import Navbar from './Navbar';
import { AreaProps, LayoutClasses, SubTodoItem, TodoItem } from './Interface';
import Todo from './Todo';
import localForage from "localforage"


const Home: React.FC = () => {

  const [TODOList, setTODOList] = useState<TodoItem[]>([]);
  const [displayCompleted, setDisplayCompleted] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [layoutType, setLayoutType] = useState<string>("axis");
  const [droppedLevel, setDroppedLevel] = useState<number>(0)
  const [layoutModeClass, setLayoutModeClass] = useState<LayoutClasses>({
    boardGird: "grid-cols-2 grid-rows-2",
    boardSize: "w-[49.5vw] h-[44vh]",
    scrollareaHeight: "h-[36vh]",
    todoSize: "w-[23vw]",
    todoGrid: "grid-cols-2 grid-rows-2",
    colorbrandWidth: "w-[49.5vw]",
    mainOverflow: ""
  });

  useEffect(() => {
    localForage.config({
      driver: localForage.INDEXEDDB,
      storeName: "AxisGTD",
      version: 1,
      description: "database for AisGTD"
    })

    localForage.getItem("TODOList").then((value) => {
      let parsedData: TodoItem[] = [];
      if (value) {
        if ((value as TodoItem[]).length === 0) {
          parsedData = []
        } else {
          parsedData = value as TodoItem[]
        }
        setTODOList(parsedData)
      }

    }).catch((e) => {
      console.log("Open database error", e)
    })

  }, [TODOList]);


  useEffect(() => {
    const displayCompletedStorage = localStorage.getItem("displayCompleted")
    if (displayCompletedStorage === "true") {
      setDisplayCompleted(true)
    } else {
      setDisplayCompleted(false)
    }
  }, [])

  useLayoutEffect(() => {
    if (layoutType === "axis") {
      setLayoutModeClass({
        boardGird: "grid-cols-2 grid-rows-2",
        boardSize: "w-[49vw] h-[44vh]",
        scrollareaHeight: "h-[36vh]",
        todoSize: "w-[23vw]",
        todoGrid: "grid-cols-2 grid-rows-2",
        colorbrandWidth: "w-[49vw]",
        mainOverflow: ""
      });
    } else if (layoutType === "kanban") {
      setLayoutModeClass({
        boardGird: "grid-cols-4 grid-rows-1",
        boardSize: "w-[24vw] h-[88vh]",
        scrollareaHeight: "h-[80vh]",
        todoSize: "w-[22vw]",
        todoGrid: "",
        colorbrandWidth: "w-[24vw]",
        mainOverflow: ""
      });
    } else if (layoutType === "board") {
      setLayoutModeClass({
        boardGird: "grid-cols-1 grid-rows-4",
        boardSize: "w-[95vw] h-[90vh]",
        scrollareaHeight: "h-[80vh]",
        todoSize: "w-[23vw]",
        todoGrid: "grid-cols-4 grid-rows-1",
        colorbrandWidth: "w-[95vw]",
        mainOverflow: "overflow-y-auto"
      });
    }
  }, [layoutType]);

  const AreaCard: AreaProps[] = [
    { level: 1, title: "Important and Urgent", des: "Do it !", color: "bg-[#E03B3B]" },
    { level: 2, title: "Important but Not Urgent", des: "Schedule it !", color: "bg-[#DD813C]" },
    { level: 3, title: "Urgent but Not Important", des: "Eliminate it !", color: "bg-[#3C7EDD]" },
    { level: 4, title: "Not Urgent and Not Important", des: "Delegate it !", color: "bg-[#848484]" },
  ]

  const tagOptions = [
    { label: 'Work', value: 'Work' },
    { label: 'Study', value: 'Study' },
    { label: 'Life', value: 'Life' },
    { label: 'Other', value: 'Other' }
  ]


  const UpdateStorge = (dataList: TodoItem[]) => {
    setTODOList(dataList);
    localForage.setItem("TODOList", dataList)
  }

  const addTodo = (index: number, text: string, level: number) => {
    const data: TodoItem = { index: index, text: text, completed: false, level: level, deadline: "", tags: [], completedtime: 0, sub: [] };
    const newTodoList = [...TODOList, data];
    UpdateStorge(newTodoList)
  };

  const reviseTodo = (index: number, text: string) => {
    const newTodoList: TodoItem[] = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {
      todo.text = text
    }
    UpdateStorge(newTodoList)

  }

  const completedTODO = (index: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)

    if (todo) {
      if (todo.completed === false) {
        todo.completedtime = Date.now();
      } else {
        todo.completedtime = 0;
      }
      todo.completed = !todo.completed
    }
    UpdateStorge(newTodoList)
  };

  const removeTODO = (index: number) => {
    const newTodoList = [...TODOList];
    const delIndex = newTodoList.findIndex((item) => item.index === index)
    if (delIndex !== -1) {
      newTodoList.splice(delIndex, 1);
    }
    UpdateStorge(newTodoList)
  };

  const addTag = (index: number, tags: string[]) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {
      todo.tags = tags;
    }
    UpdateStorge(newTodoList)
  }

  const reLevel = (index: number, targetLevel: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {
      todo.level = targetLevel
    }

    UpdateStorge(newTodoList)
  }


  const setDeadline = (index: number, deadline: string) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {
      todo.deadline = deadline
    }
    UpdateStorge(newTodoList)
  }

  const addSub = (index: number, sub: SubTodoItem) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {
      todo.sub.push(sub)
    }
    UpdateStorge(newTodoList)
  }

  const completedSubTodo = (index: number, subIndex: number, sub: SubTodoItem) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {

      const subtodo = todo.sub.find((item) => item.index === subIndex)
      if (subtodo) {
        subtodo.completed = !subtodo.completed
      }
    }
    UpdateStorge(newTodoList)
  }

  const delSubTodo = (index: number, subIndex: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {

      const delIndex = todo.sub.findIndex((i) => i.index === subIndex)
      if (delIndex !== -1) {
        todo.sub.splice(delIndex, 1)
      }
    }
    UpdateStorge(newTodoList)
  }


  const reviseSubTodo = (index: number, subIndex: number, sub: SubTodoItem, text: string) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index)
    if (todo) {

      const subtodo = todo.sub.find((item) => item.index === subIndex)
      if (subtodo) {
        subtodo.text = text
      }
    }
    UpdateStorge(newTodoList)
  }



  const shouldRenderTodo = (todo: TodoItem, item: AreaProps, searchText: string, displayCompleted: boolean) => {
    const hasSearchText = todo.text.includes(searchText) || todo.tags.some(tag => tag.includes(searchText));
    if (displayCompleted) {
      return todo.level === item.level && hasSearchText;
    }
    return todo.completed === false && todo.level === item.level && hasSearchText;
  };


  return (
    <>
      <div className={'w-screen h-screen overflow-hidden ' + layoutModeClass.mainOverflow}>
        <div className="absolute z-10">
          <Navbar addTodo={addTodo} TodoList={TODOList} setTODOList={setTODOList} setSearchText={setSearchText} setLayoutType={setLayoutType} layoutType={layoutType} setDisplayCompleted={setDisplayCompleted} displayCompleted={displayCompleted} />
        </div>
        <div className={layoutModeClass.boardGird + " grid justify-items-center pt-16 "}>
          {
            AreaCard.map((item, index) => (
              <div key={index} data-level={item.level} className={layoutModeClass.boardSize + " grid m-1 rounded shadow-md border"}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropTarget = e.target as HTMLElement;
                  let currentElement = dropTarget;
                  while (currentElement) {
                    if (currentElement.dataset.level) {
                      setDroppedLevel(parseInt(currentElement.dataset.level))

                      break;
                    }
                    currentElement = currentElement.parentElement as HTMLElement;
                  }
                }}>
                <div className={item.color + " " + layoutModeClass.colorbrandWidth + " h-[5vh] rounded-t "}>
                  <div className=" ml-3 mb-1 rounded -z-10 flex items-center justify-between">
                    <div className="flex justify-center flex-col mt-1">
                      <p className=" text-white text-l font-semibold">{item.title}</p>
                      <p className=" text-white text-xs font-light">{item.des}</p>
                    </div>
                  </div>
                </div>
                <ScrollArea className={layoutModeClass.scrollareaHeight + " rounded"}>
                  <div className={layoutModeClass.todoGrid + " grid mt-2 ml-2 mr-2 mb-2 justify-items-center"}>
                    {
                      TODOList.map((todo, index) => {
                        const renderTodo = shouldRenderTodo(todo, item, searchText, displayCompleted);
                        if (renderTodo) {
                          return (
                            <div className={layoutModeClass.todoSize} key={index} >

                              <Todo
                                key={index}
                                todo={todo}
                                droppedLevel={droppedLevel}
                                completedTODO={completedTODO}
                                removeTODO={removeTODO}
                                reviseTodo={reviseTodo}
                                addTag={addTag}
                                tagOptions={tagOptions}
                                reLevel={reLevel}
                                setDeadline={setDeadline}
                                addSub={addSub}
                                completedSubTODO={completedSubTodo}
                                delSubTodo={delSubTodo}
                                reviseSubTodo={reviseSubTodo}
                              />
                            </div>
                          );
                        }
                      })
                    }
                  </div>
                </ScrollArea>
                <p className="text-gray-300 text-xs mr-5 flex justify-end">Total {TODOList.filter((todo) => todo.level === item.level).length} Todo(s). Completed {TODOList.filter((todo) => todo.level === item.level && todo.completed === true).length} Todo(s)</p>
              </div>
            ))
          }
        </div>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default Home;
