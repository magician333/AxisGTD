'use client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Crosshair1Icon, HamburgerMenuIcon, MagnifyingGlassIcon, MoonIcon, PlusCircledIcon, SunIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { NavProps, TODOFormProps, TodoItem } from './interface';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';


function TODOForm({ addTodo,TodoList }: TODOFormProps) {
    const [value, setValue] = useState<string>("");
    const [level, setLevel] = useState<number>(0);

    const levels = [
        { name: 'Important and Urgent', code: '1' },
        { name: 'Important but Not Urgent', code: '2' },
        { name: 'Urgent but Not Important', code: '3' },
        { name: 'Not Urgent and Not Important', code: '4' },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        let lastindex = 0;
        e.preventDefault();
        if (!value) return;
        if (level === 0) {
            const nolevel = () =>
                toast("No task type", {
                    description: "You must select a task type",
                    action: {
                        label: "Ok",
                        onClick: () => console.log("Ok"),
                    },
                })
            nolevel();
            return
        };
        if (TodoList.length===0){
          lastindex = 1;
        }
        else{
          lastindex=TodoList[TodoList.length-1].index+1;
        }
        addTodo(lastindex,value, level);
        setValue("");
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <div className="flex space-y-2 justify-between flex-col items-baseline ">
                <Label htmlFor="entry_task" className="break-normal w-[14vh]">Task Content: </Label>
                <Input id='entry_task' className="w-[30vh]" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Add a task here...' />
            </div>
            <div className="flex space-y-2 justify-between flex-col items-baseline ">
                <Label htmlFor="task_select" className="break-normal w-[14vh]">Task Type: </Label>
                <div id='task_select' className="w-10/12">
                    <Select onValueChange={(e) => setLevel(Number(e))}>
                        <SelectTrigger className="space-x-2 w-[30vh]">
                            <Crosshair1Icon />
                            <SelectValue placeholder="Please select task type" ></SelectValue>
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                <SelectItem value='1'>Important and Urgent</SelectItem>
                                <SelectItem value='2'>Important but Not Urgent</SelectItem>
                                <SelectItem value='3'>Urgent but Not Important</SelectItem>
                                <SelectItem value='4'>Not Urgent and Not Important</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex  items-center justify-center">
                <DrawerClose>
                    <Button onSubmit={(e) => handleSubmit} variant="outline">Add</Button>
                </DrawerClose>
            </div>
        </form>

    );
}


function Navbar({ addTodo, TodoList, setTODOList, setSearchText, setLayoutType, layoutType, setDisplayCompleted,displayCompleted}: NavProps) {

    const { setTheme } = useTheme()
    const [fileContent, setFileContent] = useState<string>('')

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const files = event.target.files
        if (files) {
            const file = files[0]
            const reader = new FileReader()

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setFileContent(e.target?.result as string)
                } else {
                    console.error('Failed to read file content.');
                }
            }
            reader.readAsText(file)

        }
    }

    useEffect(() => {
    }, [fileContent]);

    const handleFileupload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(fileContent)
        setTODOList(JSON.parse(fileContent))
        localStorage.setItem("TODOList", fileContent)
    }

    return (
        <div className="w-screen h-[6vh] shadow flex items-center justify-between">
            <div className="w-1/12 ml-5">
                <img src="/logo.svg" alt="Logo" />
            </div>
            <div className="flex items-center space-x-10 mr-10">

                <Input id='search_input' placeholder='Search Task...' onChange={(e) => { setSearchText(e.target.value) }} />

                <Drawer>
                    <DrawerTrigger asChild>
                        <PlusCircledIcon className="size-5" />
                    </DrawerTrigger>
                    <DrawerContent className="flex items-center flex-col pt-3 pb-10 space-y-3">
                        <p className="text-2xl font-bold mb-10">Add new Task</p>
                        <TODOForm addTodo={addTodo} TodoList={TodoList}></TODOForm>
                    </DrawerContent>
                </Drawer>

                <Sheet>
                    <SheetTrigger asChild>
                        <HamburgerMenuIcon className="size-5" />
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="text-2xl">Setting</SheetHeader>
                        <SheetDescription>You can make some settings for AxisGTD here</SheetDescription>
                        <ScrollArea className="h-screen overflow-y-hidden">
                        <div className="mt-5 space-y-5 flex flex-col items-baseline">
                            <div>
                                <p className="text-l font-semibold">Theme</p>
                                <p className="text-xs font-thin mb-2">Choose the appropriate theme according to the environment</p>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span className="sr-only">Toggle theme</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            System
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <p className='text-l font-semibold' >Set layout</p>
                                <p className='text-xs font-thin mb-2'>Set the layout of the interface</p>
                                <Select defaultValue='axis' onValueChange={(e) => setLayoutType(e)} value={layoutType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Set layout"></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='axis'>Axis Default (2*2) </SelectItem>
                                        <SelectItem value='kanban'>Kanban Mode (4*1) </SelectItem>
                                        <SelectItem value='board'>Big Board (1*4) </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="text-l font-semibold">Enable System Notifications</p>
                                <p className="text-xs font-thin mb-2">Make sure you have turned on notification permissions</p>
                                <Button variant="outline" onClick={
                                  (e)=>{
                                    Notification.requestPermission().then((result)=>{
                                      if (result==="granted"){
                                        const hadPermission = () =>{
                                          toast("Permissions are already available",{
                                            description:"AxisGTD has been granted system notification permissions"
                                            })
                                        }
                                        hadPermission()
                                      }
                                      else if (result==="denied"){
                                        const NoPermission = () =>{
                                          toast("The request was denied",{
                                            description:"Please check your browser settings for AxisGTD to get notification permissions"
                                            })
                                        }
                                        NoPermission()
                                      }
                                      console.log((result))
                                      })
                                    
                                  }
                                }>Enable</Button>
                            </div>

                            <div>
                                <p className="text-l font-semibold">Display Completed Task</p>
                                <p className="text-xs font-thin mb-2">If you want to focus only on completed tasks, you can turn this switch on</p>

                                <Switch checked={displayCompleted} 
                                onCheckedChange={
                                  (e)=>{
                                    setDisplayCompleted(e)
                                  }
                                } />
                            </div>


                            <div>
                                <p className="text-l font-semibold">Data Export</p>
                                <p className="text-xs font-thin mb-2">You can export data to other browsers or devices for use</p>

                                <Button variant="outline" onClick={() => {
                                    const date = Date.now().toString()
                                    const blob = new Blob([JSON.stringify(TodoList)], { "type": "application/json" })
                                    const url = URL.createObjectURL(blob)
                                    const link = document.createElement("a")
                                    link.href = url;
                                    link.download = "AxisGTD-" + date + ".json"
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                    URL.revokeObjectURL(url)
                                }}>Download</Button>
                            </div>

                            <div>
                                <p className="text-l font-semibold">Data Export</p>
                                <p className="text-xs font-thin mb-2">Import previously exported data</p>
                                <div>
                                    <form onSubmit={handleFileupload} className="flex space-x-2">
                                        <Input type="file" accept='.json' onChange={handleFileChange} />
                                        <Button variant="outline" onClick={(e) => handleFileupload}>Upload</Button>
                                    </form>
                                </div>
                            </div>

                            <div>
                                <p className="text-l font-semibold">Data Clear</p>
                                <p className="text-xs font-thin mb-2">It is important to note that this operation is not reversible</p>
                                <Button variant="outline" onClick={() => {
                                    setTODOList([])
                                    localStorage.setItem("TODOList", "")
                                }}>Clear</Button>
                            </div>

                            <div>
                                <p className="text-l font-semibold mb-2">About</p>
                                <p className="break-words font-light text-sm">
                                    A minimalistic and serene personal office TodoList software that empowers you to prioritize tasks effectively, with AxisGTD serving as a helpful aid. However, don't become overlydependent on AxisGTD.
                                    It should be viewed as a mere component of your efficient office setup. Simply capture your tasks within the app, set AxisGTD aside, and return to it later to mark off completed items once your work is finished.
                                </p>
                            </div>
                        </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default Navbar
