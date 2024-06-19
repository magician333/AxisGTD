"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BellIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  LapTimerIcon,
  TokensIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import MultipleSelector from "@/components/ui/MultipleSelector";
import {
  DateTimePicker,
  DateTimePickerRef,
} from "@/components/ui/DatetimePicker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SubTodoItem, TodoProps } from "./Interface";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { TodoColor } from "./DeafultProps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Switch } from "@/components/ui/switch";

function Todo({
  todo,
  completedTODO,
  removeTODO,
  pinTodo,
  reviseTodo,
  addTag,
  tagOptions,
  reLevel,
  setDeadline,
  setAhead,
  droppedLevel,
  droppedIndex,
  reSort,
  addSub,
  completedSubTODO,
  delSubTodo,
  reviseSubTodo,
  lang,
}: TodoProps) {
  const datetimePicker = useRef<DateTimePickerRef>(null);
  const [value, setValue] = useState<string>("");
  const [reviseText, setReviseText] = useState<string>(todo.text)
  const [isRevise, setIsRevise] = useState<boolean>(false)
  const [reviseSubText, setReviseSubText] = useState<string[]>(todo.sub.map(sub => sub.text))
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    let lastindex = 0;
    if (todo.sub.length === 0) {
      lastindex = 1;
    } else {
      lastindex = todo.sub[todo.sub.length - 1].index + 1;
    }
    const newSubTodoItem: SubTodoItem = {
      index: lastindex,
      text: value,
      completed: false,
    };
    addSub(todo.index, newSubTodoItem);

    const tmpSub = [...reviseSubText, value]
    setReviseSubText(tmpSub)

    setValue("");
  };

  return (
    <div
      className="shadow-md rounded bg-white mb-2 ml-1 mr-1 dark:bg-zinc-950 border"
      style={{ opacity: todo.completed ? "0.2" : "1" }}
    >
      <div
        className="w-full h-[1vh] rounded-t"
        style={{ backgroundColor: todo.completed ? TodoColor.get("completed") : TodoColor.get("uncompleted") }}
        draggable
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnd={(e) => {
          e.preventDefault();
          reLevel(todo.index, droppedLevel);
          reSort(todo.index, droppedIndex);
        }}
      ></div>
      <div className="flex items-center ml-3 mr-3 mt-2 mb-2 space-x-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => completedTODO(todo.index)}
        />
        <Textarea
          rows={3}
          cols={50}
          className="break-words border-none resize-none h-[3rem] shadow-none no-scrollbar"
          readOnly={todo.completed}
          value={reviseText}
          style={{
            textDecoration: todo.completed ? "line-through" : "",
            boxShadow: isRevise ? "0 1px 2px 0 #ff3333" : ""
          }}
          onChange={(e) => {
            setReviseText(e.target.value)
            if (e.target.value !== todo.text) {
              setIsRevise(true)
            }
          }}
          onBlur={() => {
            if (reviseText !== todo.text) {
              reviseTodo(todo.index, reviseText)
            }
            setIsRevise(false)
          }}
        />
      </div>
      <div className="ml-3 mr-3">
        <form>
          <MultipleSelector
            className="break-normal"
            options={tagOptions}
            value={todo.tags.map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
            creatable
            onChange={(e) =>
              addTag(
                todo.index,
                e.map((item) => item.value)
              )
            }
            placeholder={lang["todo_tag_add_placeholder"]}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                {lang["todo_tag_noresult"]}
              </p>
            }
          />
        </form>
      </div>
      <Separator className="opacity-40" />

      <div className="flex items-center justify-between ml-3 mr-3 mt-2 mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {todo?.pin ? (
                <DrawingPinFilledIcon onClick={() => pinTodo(todo.index)} />
              ) : (
                <DrawingPinIcon onClick={() => pinTodo(todo.index)} />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{lang["todo_pin"]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>


        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/zen/${todo.index}`}>
                <LapTimerIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{lang["todo_zen"]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BellIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {todo.deadline === ""
                      ? lang["todo_deadline"]
                      : todo.deadline}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lang["todo_deadline_dialog_title"]}</DialogTitle>
              <DialogDescription>
                {lang["todo_deadline_dialog_des"]}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center space-x-1">
              <DateTimePicker
                granularity="second"
                ref={datetimePicker}
                jsDate={
                  todo.deadline === ""
                    ? null
                    : new Date(JSON.parse(todo.deadline))
                }
              />
              <Select onValueChange={(e) => { setAhead(todo.index, e) }} defaultValue="a0" value={todo.ahead ? "a" + String(todo.ahead) : "a0"}>
                <SelectTrigger className="w-48 h-full">
                  <SelectValue placeholder={lang["todo_deadline_dialog_ahead"]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a0">{lang["todo_deadline_dialog_ahead_1"]}</SelectItem>
                  <SelectItem value="a900000">{lang["todo_deadline_dialog_ahead_2"]}</SelectItem>
                  <SelectItem value="a1800000">{lang["todo_deadline_dialog_ahead_3"]}</SelectItem>
                  <SelectItem value="a3600000">{lang["todo_deadline_dialog_ahead_4"]}</SelectItem>
                  <SelectItem value="a86400000">{lang["todo_deadline_dialog_ahead_5"]}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  if (datetimePicker.current?.jsDate) {
                    if (
                      (datetimePicker.current?.jsDate?.getTime() as number) -
                      new Date().getTime() >=
                      0
                    ) {
                      setDeadline(
                        todo.index,
                        JSON.stringify(
                          datetimePicker.current?.jsDate?.toLocaleString()
                        )
                      );
                    }
                  } else {
                    setDeadline(todo.index, "");
                  }
                }}
              >
                {lang["todo_deadline_dialog_button"]}
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TokensIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {todo.sub?.length === 0
                      ? lang["todo_subtodo"]
                      : todo.sub?.length + lang["todo_subtodos"]}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lang["todo_subtodo_dialog_title"]}</DialogTitle>
              <DialogDescription>
                {lang["todo_subtodo_dialog_des"]}
              </DialogDescription>
              <div className="flex flex-col">
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="flex space-x-3 justify-start mb-2 ml-5 mr-5 mt-3"
                  >
                    <Input
                      placeholder={
                        lang["todo_subtodo_dialog_input_placeholder"]
                      }
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                    />
                    <Button variant="outline" type="submit">
                      {lang["todo_subtodo_dialog_add_button"]}
                    </Button>
                  </form>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Progress
                        value={
                          (todo.sub.filter((item) => item.completed === true)
                            .length /
                            todo.sub.length) *
                          100
                        }
                        className="w-auto ml-5 mr-5 mb-2"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {lang["todo_subtodo_dialog_progressbar"]}{" "}
                        {todo.sub.length > 0
                          ? Math.round(
                            (todo.sub.filter(
                              (item) => item.completed === true
                            ).length /
                              todo.sub.length) *
                            100
                          )
                          : 0}{" "}
                        %
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ScrollArea className="h-[36vh]">
                  {
                    todo.sub?.map((item, index) => {

                      return (
                        <div
                          key={index}
                          className="group flex space-x-3 items-center mb-2 mr-5 ml-5 mt-2"
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() =>
                              completedSubTODO(todo.index, item.index)
                            }
                          />

                          <Input
                            value={reviseSubText[index]}
                            className="border-none shadow-none overflow-x-auto"
                            style={{
                              textDecoration: item.completed
                                ? "line-through"
                                : "",
                            }}
                            disabled={item.completed}
                            onChange={(e) => {
                              const tmp = [...reviseSubText]
                              tmp[index] = e.target.value
                              setReviseSubText(tmp)
                            }}
                            onBlur={() => {
                              if (reviseSubText[index] !== item.text) {
                                reviseSubTodo(
                                  todo.index,
                                  item.index,
                                  reviseSubText[index]
                                )
                              }
                            }}
                          />
                          <TrashIcon
                            onClick={() => {
                              delSubTodo(todo.index, item.index);
                            }}
                            className="opacity-0 group-hover:opacity-100"
                          />
                        </div>
                      );
                    })}
                </ScrollArea>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TrashIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lang["todo_delete"]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              {lang["todo_delete_dialog_title"]}
            </DialogHeader>
            <DialogDescription>
              {lang["todo_delete_dialog_des"]}
            </DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button>{lang["todo_delete_dialog_cancelbutton"]}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    removeTODO(todo.index)
                  }}
                >
                  {lang["todo_delete_dialog_delbutton"]}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Todo;
