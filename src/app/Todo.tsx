'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster, toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon, LapTimerIcon, Link2Icon, TokensIcon, TrashIcon, UpdateIcon } from '@radix-ui/react-icons';
import MultipleSelector, { Option } from '@/components/ui/MultipleSelector';
import { DateTimePicker, DateTimePickerRef } from '@/components/ui/DatetimePicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { TodoProps } from './interface';


function Todo({ todo, completedTODO, removeTODO, reviseTodo, addTag, tagOptions, reLevel, setDeadline }: TodoProps) {
    const datetimePicker = useRef<DateTimePickerRef>(null)

    const [deadlinePopoverStatus, setDeadlinePopoverStatus] = useState<boolean>(false)

    return (
        <div className="shadow-md rounded bg-white mb-2 ml-1 mr-1" style={{ opacity: todo.completed ? '0.2' : "1" }} draggable
            onDragOver={(e) => {
                e.preventDefault()
            }}
        >
            <div className="w-full h-[1vh] rounded-t" style={{ backgroundColor: todo.completed ? '#39834A' : "#FF3333" }} >
            </div>
            <div className="flex items-center ml-3 mr-3 mt-2 mb-2 space-x-2">
                <Checkbox checked={todo.completed} onCheckedChange={() => completedTODO(todo.index)} />
                <Textarea rows={3} cols={50} className="break-words max-h-20 max-w-200 border-none resize-none h-[3rem]" readOnly={todo.completed} value={todo.text} style={{ textDecoration: todo.completed ? 'line-through' : "" }} onChange={(e) =>
                    reviseTodo(todo.index, e.target.value)
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
                        onChange={(e) => addTag(todo.index, e.map((item) => item.value))}
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
                            <UpdateIcon onClick={() => reLevel(todo.index, 4)} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Set Level</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>


                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={{
                                pathname: "/zen",
                                query: { index: todo.index }
                            }}
                            >
                                <LapTimerIcon />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Zen Mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>



                <Popover open={deadlinePopoverStatus} onOpenChange={() => { setDeadlinePopoverStatus(true) }}>
                    <PopoverTrigger>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CalendarIcon />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{todo.deadline === "" ? "Deadline" : todo.deadline}</p>
                                </TooltipContent>
                            </Tooltip>

                        </TooltipProvider>
                    </PopoverTrigger>
                    <PopoverContent className='flex flex-col space-y-5 items-center'>
                        <p>Select Dealine</p>
                        <DateTimePicker granularity="second" ref={datetimePicker} jsDate={todo.deadline === "" ? null : new Date(JSON.parse(todo.deadline))} />
                        <Button variant="outline" onClick={() => {
                            if (datetimePicker.current?.jsDate) {
                                if ((datetimePicker.current?.jsDate?.getTime() as number) - (new Date().getTime()) >= 0) {
                                    setDeadline(todo.index, JSON.stringify(datetimePicker.current?.jsDate?.toLocaleString()));
                                }
                                else {
                                    toast("The time is illegal", { description: "Must be set after the current date!" })
                                }
                            } else {
                                setDeadline(todo.index, "")
                            }

                            setDeadlinePopoverStatus(false)
                        }
                        }>
                            Confirm
                        </Button>
                    </PopoverContent>
                </Popover>


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
                            <TrashIcon onClick={() => removeTODO(todo.index)} />
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

export default Todo