"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  AreaDisplayCompletedProps,
  AreaProps,
  HideNavProps,
  LayoutClasses,
  SubTodoItem,
  syncConfigProps,
  TodoItem,
} from "./Interface";
import Todo from "./Todo";
import localForage from "localforage";
import { ToastAction } from "@/components/ui/toast";
import { levelColor } from "./DeafultProps";
import { Option } from "@/components/ui/MultipleSelector";
import { CircleBackslashIcon, CircleIcon } from "@radix-ui/react-icons";

const Home: React.FC = () => {
  const [TODOList, setTODOList] = useState<TodoItem[]>([]);
  const [displayCompleted, setDisplayCompleted] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [layoutType, setLayoutType] = useState<string>("axis");
  const [displayLang, setDisplayLang] = useState<string>("en_US");
  const [droppedLevel, setDroppedLevel] = useState<number>(0);
  const [droppedIndex, setDroppedIndex] = useState<number>(0);
  const [intervals, setIntervals] = useState<NodeJS.Timeout[]>([]);
  const [areaCard, setAreaCard] = useState<AreaProps[]>([]);
  const [syncUrl, setSyncUrl] = useState<string>("");
  const [syncID, setSyncID] = useState<string>("");
  const [hideFunc, setHideFunc] = useState<HideNavProps>({
    theme: false,
    calendar: false,
    sync: false,
    trash: false,
  });

  const [tagOptions, setTagOptions] = useState<Option[]>([
    { label: "Work", value: "Work" },
    { label: "Study", value: "Study" },
    { label: "Life", value: "Life" },
    { label: "Other", value: "Other" },
  ]);

  const [lang, setLang] = useState<any>({});

  useEffect(() => {
    let localLang = localStorage.getItem("language") as string;
    localLang = localLang || "en_US";
    setDisplayLang(localLang);

    let hideNav = (localStorage.getItem("hideNav") as string) || "";
    try {
      setHideFunc(JSON.parse(hideNav));
    } catch {
      setHideFunc({
        theme: false,
        calendar: false,
        sync: false,
        trash: false,
      });
    }

    let tags = (localStorage.getItem("tags") as string) || "";
    try {
      setTagOptions(JSON.parse(tags));
    } catch {
      setTagOptions([
        { label: "Work", value: "Work" },
        { label: "Study", value: "Study" },
        { label: "Life", value: "Life" },
        { label: "Other", value: "Other" },
      ]);
    }
  }, []);

  useEffect(() => {}, []);
  useEffect(() => {
    const setLanguage = async () => {
      await import("../../public/locales/" + displayLang + ".json").then(
        (langData) => {
          setLang(langData.default);
          const areaDisplayCompletedStorage = localStorage.getItem(
            "AreaDisplayCompleted"
          );
          var areaDisplayCompleted: AreaDisplayCompletedProps[];
          if (areaDisplayCompletedStorage) {
            areaDisplayCompleted = JSON.parse(areaDisplayCompletedStorage);
          } else {
            areaDisplayCompleted = [
              {
                level: 1,
                status: true,
              },
              {
                level: 2,
                status: true,
              },
              {
                level: 3,
                status: true,
              },
              {
                level: 4,
                status: true,
              },
            ];
          }
          setAreaCard([
            {
              level: 1,
              title: langData["axis_name_1"],
              des: langData["axis_des_1"],
              color: levelColor.get("1") as string,
              displayCompleted: areaDisplayCompleted.find(
                (item) => item.level == 1
              )?.status
                ? true
                : false,
            },
            {
              level: 2,
              title: langData["axis_name_2"],
              des: langData["axis_des_2"],
              color: levelColor.get("2") as string,
              displayCompleted: areaDisplayCompleted.find(
                (item) => item.level == 2
              )?.status
                ? true
                : false,
            },
            {
              level: 3,
              title: langData["axis_name_3"],
              des: langData["axis_des_3"],
              color: levelColor.get("3") as string,
              displayCompleted: areaDisplayCompleted.find(
                (item) => item.level == 3
              )?.status
                ? true
                : false,
            },
            {
              level: 4,
              title: langData["axis_name_4"],
              des: langData["axis_des_4"],
              color: levelColor.get("4") as string,
              displayCompleted: areaDisplayCompleted.find(
                (item) => item.level == 4
              )?.status
                ? true
                : false,
            },
          ]);
        }
      );
    };
    setLanguage();
  }, [displayLang]);

  useEffect(() => {
    localForage.config({
      driver: localForage.INDEXEDDB,
      storeName: "AxisGTD",
      version: 1,
      description: "database for AisGTD",
    });

    localForage
      .getItem("TODOList")
      .then((value) => {
        let parsedData: TodoItem[] = [];
        if (value) {
          if ((value as TodoItem[]).length === 0) {
            parsedData = [];
          } else {
            parsedData = value as TodoItem[];
          }
          setTODOList(parsedData);
        }
      })
      .catch((e) => {
        console.log("Open database error", e);
      });
  }, [TODOList]);

  let timers: NodeJS.Timeout[] = [];

  useEffect(() => {
    const createTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
      TODOList.forEach((item) => {
        if (item.deadline) {
          let ahead = item.ahead;
          if (ahead === undefined) {
            ahead = 0;
          }
          const deadlineDate = new Date(JSON.parse(item.deadline));
          const remainingTime = deadlineDate.getTime() - Date.now() - ahead;
          if (remainingTime < 0 && !item.isRemind) {
            return;
          }
          if (!item.isRemind) {
            const intervalId = setTimeout(() => {
              handleReminder(item);
              setIsRemind(item.index, true);
            }, remainingTime);
            timers.push(intervalId);
            setIntervals(timers);
          }
        }
      });
    };

    createTimers();
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [TODOList]);

  const handleReminder = (item: TodoItem) => {
    toast(lang["toast_deadline_title"] + item.deadline, {
      description:
        lang["toast_deadline_content_1"] +
        item.text +
        lang["toast_deadline_content_2"],
      action: (
        <ToastAction
          altText={lang["toast_deadline_button"]}
          onClick={() => completedTODO(item.index)}
        >
          {lang["toast_deadline_button"]}
        </ToastAction>
      ),
    });
    new Notification(lang["toast_deadline_title"] + item.deadline, {
      body:
        lang["toast_deadline_content_1"] +
        item.text +
        lang["toast_deadline_content_2"],
      icon: "/icons/icon-circle.png",
    });
  };

  useEffect(() => {
    const displayCompletedStorage = localStorage.getItem("displayCompleted");
    if (displayCompletedStorage === "true") {
      setDisplayCompleted(true);
    } else {
      setDisplayCompleted(false);
    }
  }, []);

  const displayTodo = useMemo(() => {
    return TODOList;
  }, [TODOList]);

  const layoutModeClass = useMemo(() => {
    const baseClass: LayoutClasses = {
      boardGird: "grid-cols-2 grid-rows-2",
      boardSize: "w-[49vw] h-[44vh]",
      scrollareaHeight: "h-[36vh]",
      todoSize: "w-[23vw]",
      todoGrid: "grid-cols-2 grid-rows-2",
      colorbrandWidth: "w-[49vw]",
      mainOverflow: "",
    };
    switch (layoutType) {
      case "axis":
        return {
          boardGird: "grid-cols-2 grid-rows-2",
          boardSize: "w-[49vw] h-[44vh]",
          scrollareaHeight: "h-[36vh]",
          todoSize: "w-[23vw]",
          todoGrid: "grid-cols-2 grid-rows-2",
          colorbrandWidth: "w-[49vw]",
          mainOverflow: "",
        };
      case "kanban":
        return {
          boardGird: "grid-cols-4 grid-rows-1",
          boardSize: "w-[24vw] h-[88vh]",
          scrollareaHeight: "h-[80vh]",
          todoSize: "w-[22vw]",
          todoGrid: "",
          colorbrandWidth: "w-[24vw]",
          mainOverflow: "",
        };
      case "board":
        return {
          boardGird: "grid-cols-1 grid-rows-4",
          boardSize: "w-[95vw] h-[90vh]",
          scrollareaHeight: "h-[80vh]",
          todoSize: "w-[23vw]",
          todoGrid: "grid-cols-4 grid-rows-1",
          colorbrandWidth: "w-[95vw]",
          mainOverflow: "overflow-y-auto",
        };
      default:
        return baseClass;
    }
  }, [layoutType]);

  const pushData = async () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Todolist: JSON.stringify(TODOList),
        Time: Date.now(),
        Config: JSON.stringify({
          language: displayLang,
          layout: layoutType,
          displayCompleted: displayCompleted,
          hideNav: hideFunc,
          tags: tagOptions,
        }),
      }),
    };
    const response = await fetch(`${syncUrl}\\sync\\${syncID}`, options);
    if (!response.ok) {
      toast(lang["sync_push_fail_title"], {
        description: lang["sync_push_fail_des"],
      });
    } else {
      toast(lang["sync_push_ok_title"], {
        description: lang["sync_push_ok_des"],
      });
    }
  };

  const pullData = async (
    todolistData: TodoItem[],
    configData: syncConfigProps,
    time: number
  ) => {
    setTODOList(todolistData);
    localForage.setItem("TODOList", todolistData);

    const setProps = (
      stateFunc: React.Dispatch<React.SetStateAction<any>>,
      flag: keyof syncConfigProps,
      defaultValue: any
    ) => {
      const value =
        configData[flag] !== undefined ? configData[flag] : defaultValue;
      stateFunc(value);
      localStorage.setItem(
        flag,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    };

    setProps(setDisplayLang, "language", "en_US");
    setProps(setLayoutType, "layout", "axis");
    setProps(setDisplayCompleted, "displayCompleted", true);
    setProps(setHideFunc, "hideNav", {
      theme: false,
      calendar: false,
      sync: false,
      trash: false,
    });
    setProps(setTagOptions, "tags", [
      { label: "Work", value: "Work" },
      { label: "Study", value: "Study" },
      { label: "Life", value: "Life" },
      { label: "Other", value: "Other" },
    ]);

    const syncTime =
      new Date(time).toLocaleTimeString() +
      " " +
      new Date(time).toLocaleDateString();
    toast(lang["sync_pull_ok_title"], {
      description: lang["sync_pull_ok_des"] + syncTime,
    });
  };

  const UpdateStorage = (dataList: TodoItem[]) => {
    setTODOList(dataList);
    localForage.setItem("TODOList", dataList);
  };

  const addTodo = (index: number, text: string, level: number) => {
    const nowTime = Date.now();
    const data: TodoItem = {
      index: index,
      text: text,
      completed: false,
      level: level,
      pin: false,
      isRemind: false,
      deadline: "",
      ahead: 0,
      tags: [],
      createdtime: nowTime,
      completedtime: 0,
      sub: [],
      trash: false,
    };
    const newTodoList = [...TODOList, data];
    UpdateStorage(newTodoList);
  };

  const reviseTodo = (index: number, text: string) => {
    const newTodoList: TodoItem[] = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.text = text;
    }
    UpdateStorage(newTodoList);
  };

  const completedTODO = (index: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);

    if (todo) {
      if (todo.completed === false) {
        todo.completedtime = Date.now();
      } else {
        todo.completedtime = 0;
      }
      todo.completed = !todo.completed;
    }
    UpdateStorage(newTodoList);
  };

  const trashTodo = (index: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.trash = true;
    }
    UpdateStorage(newTodoList);
  };

  const restoreTodo = (indexList: number[]) => {
    indexList.map((index) => {
      const newTodoList = [...TODOList];
      const todo = newTodoList.find((item) => item.index === index);
      if (todo) {
        todo.trash = false;
      }
      UpdateStorage(newTodoList);
    });
  };
  const removeTodo = (indexList: number[]) => {
    const newTodoList = [...TODOList];
    while (indexList.length > 0) {
      const index = indexList.shift();
      if (index) {
        const delIndex = newTodoList.findIndex((item) => item.index === index);
        if (delIndex !== -1) {
          newTodoList.splice(delIndex, 1);
        }
      }
    }
    UpdateStorage(newTodoList);
  };

  const pinTodo = (index: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.pin = !todo.pin;
    }
    UpdateStorage(newTodoList);
  };

  const addTag = (index: number, tags: string[]) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.tags = tags;
    }
    UpdateStorage(newTodoList);
  };

  const reLevel = (index: number, targetLevel: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.level = targetLevel;
    }
    UpdateStorage(newTodoList);
  };

  const setIsRemind = (index: number, flag: boolean) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.isRemind = flag;
    }
    UpdateStorage(newTodoList);
  };

  const setDeadline = (index: number, deadline: string) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.deadline = deadline;
      todo.isRemind = false;
    }
    UpdateStorage(newTodoList);
  };

  const setAhead = (index: number, ahead: string) => {
    let time = Number(ahead.substring(1));
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.ahead = time;
    }
    UpdateStorage(newTodoList);
  };

  const addSub = (index: number, sub: SubTodoItem) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      todo.sub.push(sub);
    }
    UpdateStorage(newTodoList);
  };

  const completedSubTodo = (index: number, subIndex: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      const subtodo = todo.sub.find((item) => item.index === subIndex);
      if (subtodo) {
        subtodo.completed = !subtodo.completed;
      }
    }
    UpdateStorage(newTodoList);
  };

  const delSubTodo = (index: number, subIndex: number) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      const delIndex = todo.sub.findIndex((i) => i.index === subIndex);
      if (delIndex !== -1) {
        todo.sub.splice(delIndex, 1);
      }
    }
    UpdateStorage(newTodoList);
  };

  const reviseSubTodo = (index: number, subIndex: number, text: string) => {
    const newTodoList = [...TODOList];
    const todo = newTodoList.find((item) => item.index === index);
    if (todo) {
      const subtodo = todo.sub.find((item) => item.index === subIndex);
      if (subtodo) {
        subtodo.text = text;
      }
    }
    UpdateStorage(newTodoList);
  };

  const toggleDisplayCompleted = (status: boolean) => {
    areaCard.map((item) => {
      item.displayCompleted = status;
    });
  };

  const shouldRenderTodo = useCallback(
    (todo: TodoItem, item: AreaProps, searchText: string) => {
      const hasSearchText =
        todo.text.includes(searchText) ||
        todo.tags.some((tag) => tag.includes(searchText));
      if (item.displayCompleted) {
        return todo.level === item.level && hasSearchText;
      }
      return (
        todo.completed === false && todo.level === item.level && hasSearchText
      );
    },
    [TODOList, displayCompleted, layoutType]
  );

  return (
    <>
      <div
        className={
          "w-screen h-screen overflow-hidden " + layoutModeClass.mainOverflow
        }
      >
        <div className="absolute z-10">
          <Navbar
            addTodo={addTodo}
            TodoList={TODOList}
            updateStorage={UpdateStorage}
            setTODOList={setTODOList}
            setSearchText={setSearchText}
            setLayoutType={setLayoutType}
            layoutType={layoutType}
            setDisplayCompleted={setDisplayCompleted}
            displayCompleted={displayCompleted}
            toggleDisplayCompleted={toggleDisplayCompleted}
            displayLang={displayLang}
            setDisplayLang={setDisplayLang}
            lang={lang}
            removeTodo={removeTodo}
            restoreTodo={restoreTodo}
            syncUrl={syncUrl}
            setSyncUrl={setSyncUrl}
            pushData={pushData}
            pullData={pullData}
            syncID={syncID}
            setSyncID={setSyncID}
            hideFunc={hideFunc}
            setHideFunc={setHideFunc}
            tagOptions={tagOptions}
            setTagOptions={setTagOptions}
          />
        </div>
        <div
          className={
            layoutModeClass.boardGird + " grid justify-items-center pt-16 "
          }
        >
          {areaCard.map((item, index) => (
            <div
              key={index}
              data-level={item.level}
              className={
                layoutModeClass.boardSize + " grid m-1 rounded shadow-md border"
              }
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const dropTarget = e.target as HTMLElement;
                let currentElement = dropTarget;
                while (currentElement) {
                  if (currentElement.dataset.level) {
                    setDroppedLevel(parseInt(currentElement.dataset.level));
                    break;
                  }
                  currentElement = currentElement.parentElement as HTMLElement;
                }
              }}
            >
              <div
                className={
                  item.color +
                  " " +
                  layoutModeClass.colorbrandWidth +
                  " h-full rounded-t "
                }
              >
                <div className=" ml-3 mb-1 rounded -z-10 flex items-center justify-between group">
                  <div className="flex justify-center flex-col mt-1 ">
                    <div className="flex space-x-2 items-center ">
                      <p className=" text-white text-l font-semibold">
                        {item.title}
                      </p>
                      <div
                        className="text-white"
                        onClick={() => {
                          item.displayCompleted = !item.displayCompleted;

                          const areaDisplayCompletedData = areaCard.map(
                            (area) => ({
                              level: area.level,
                              status: area.displayCompleted,
                            })
                          );
                          localStorage.setItem(
                            "AreaDisplayCompleted",
                            JSON.stringify(areaDisplayCompletedData)
                          );
                        }}
                      >
                        {item.displayCompleted ? (
                          <CircleIcon className="opacity-0 group-hover:opacity-100" />
                        ) : (
                          <CircleBackslashIcon className="opacity-0 group-hover:opacity-100" />
                        )}
                      </div>
                    </div>
                    <p className=" text-white text-xs font-light">{item.des}</p>
                  </div>
                </div>
              </div>
              <ScrollArea
                className={layoutModeClass.scrollareaHeight + " rounded"}
              >
                {
                  <div
                    className={
                      layoutModeClass.todoGrid +
                      " grid mt-2 ml-2 mr-2 mb-2 justify-items-center"
                    }
                  >
                    {displayTodo.map((todo, index) => {
                      const renderTodo = shouldRenderTodo(
                        todo,
                        item,
                        searchText
                      );
                      if (renderTodo && todo.pin && !todo.trash) {
                        return (
                          <div
                            className={layoutModeClass.todoSize}
                            key={index}
                            data-index={todo.index}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              const dropTodoTarget = e.target as HTMLElement;
                              let currentTodo = dropTodoTarget;
                              while (currentTodo) {
                                if (currentTodo.dataset.index) {
                                  setDroppedIndex(
                                    parseInt(currentTodo.dataset.index)
                                  );
                                  break;
                                }
                                currentTodo =
                                  currentTodo.parentElement as HTMLElement;
                              }
                            }}
                          >
                            <Todo
                              key={index}
                              todo={todo}
                              droppedLevel={droppedLevel}
                              droppedIndex={droppedIndex}
                              completedTODO={completedTODO}
                              trashTodo={trashTodo}
                              pinTodo={pinTodo}
                              reviseTodo={reviseTodo}
                              addTag={addTag}
                              tagOptions={tagOptions}
                              reLevel={reLevel}
                              setDeadline={setDeadline}
                              setAhead={setAhead}
                              addSub={addSub}
                              completedSubTODO={completedSubTodo}
                              delSubTodo={delSubTodo}
                              restoreTodo={restoreTodo}
                              reviseSubTodo={reviseSubTodo}
                              lang={lang}
                            />
                          </div>
                        );
                      }
                    })}
                    {displayTodo.map((todo, index) => {
                      const renderTodo = shouldRenderTodo(
                        todo,
                        item,
                        searchText
                      );
                      if (renderTodo && !todo.pin && !todo.trash) {
                        return (
                          <div
                            className={layoutModeClass.todoSize}
                            key={index}
                            data-index={todo.index}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              const dropTodoTarget = e.target as HTMLElement;
                              let currentTodo = dropTodoTarget;
                              while (currentTodo) {
                                if (currentTodo.dataset.index) {
                                  setDroppedIndex(
                                    parseInt(currentTodo.dataset.index)
                                  );
                                  break;
                                }
                                currentTodo =
                                  currentTodo.parentElement as HTMLElement;
                              }
                            }}
                          >
                            <Todo
                              key={index}
                              todo={todo}
                              droppedLevel={droppedLevel}
                              droppedIndex={droppedIndex}
                              completedTODO={completedTODO}
                              trashTodo={trashTodo}
                              pinTodo={pinTodo}
                              reviseTodo={reviseTodo}
                              addTag={addTag}
                              tagOptions={tagOptions}
                              reLevel={reLevel}
                              setDeadline={setDeadline}
                              setAhead={setAhead}
                              addSub={addSub}
                              completedSubTODO={completedSubTodo}
                              delSubTodo={delSubTodo}
                              restoreTodo={restoreTodo}
                              reviseSubTodo={reviseSubTodo}
                              lang={lang}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                }
              </ScrollArea>
              <p className="text-gray-300 text-xs mr-5 flex justify-end">
                {lang["axis_total"]}
                {
                  TODOList.filter((todo) => todo.level === item.level).length
                }{" "}
                {lang["axis_todos"]}. {lang["axis_completed"]}{" "}
                {
                  TODOList.filter(
                    (todo) =>
                      todo.level === item.level && todo.completed === true
                  ).length
                }{" "}
                {lang["axis_todos"]}
              </p>
            </div>
          ))}
        </div>
        <Footer lang={lang} />
        <Toaster />
      </div>
    </>
  );
};

export default Home;
