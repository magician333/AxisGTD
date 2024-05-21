'use client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Crosshair1Icon, EnvelopeClosedIcon, FileTextIcon, GitHubLogoIcon, HamburgerMenuIcon, HeartIcon, MagnifyingGlassIcon, MoonIcon, PersonIcon, PlusCircledIcon, SunIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { NavProps, TODOFormProps, TodoItem } from './interface';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';


function TODOForm({ addTodo, TodoList }: TODOFormProps) {
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
      toast("No Todo type", {
        description: "You must select a todo type",
      })
      return
    };
    if (TodoList.length === 0) {
      lastindex = 1;
    }
    else {
      lastindex = TodoList[TodoList.length - 1].index + 1;
    }
    addTodo(lastindex, value, level);
    setValue("");
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <div className="flex space-y-2 justify-between flex-col items-baseline ">
        <Label htmlFor="entry_todo" className="break-normal w-[14vh]">Todo Content: </Label>
        <Input id='entry_todo' className="w-[30vh]" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Add a Todo here...' />
      </div>
      <div className="flex space-y-2 justify-between flex-col items-baseline ">
        <Label htmlFor="todo_select" className="break-normal w-[14vh]">Todo Type: </Label>
        <div id='todo_select' className="w-10/12">
          <Select onValueChange={(e) => setLevel(Number(e))}>
            <SelectTrigger className="space-x-2 w-[30vh]">
              <Crosshair1Icon />
              <SelectValue placeholder="Please select Todo type" ></SelectValue>
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


function Navbar({ addTodo, TodoList, setTODOList, setSearchText, setLayoutType, layoutType, setDisplayCompleted, displayCompleted }: NavProps) {

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

  useEffect(() => {
    const layoutStorage = localStorage.getItem("layout")
    if (layoutStorage) {
      setLayoutType(layoutStorage)
    }
    else {
      setLayoutType("axis")
    }

  }, [])

  const handleFileupload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(fileContent)
    setTODOList(JSON.parse(fileContent))
    localStorage.setItem("TODOList", fileContent)
  }

  return (
    <div className="w-screen h-[6vh] shadow flex items-center justify-between bg-white dark:bg-zinc-950 dark:border-b">
      <div className="w-1/12 ml-5">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <div className="flex items-center space-x-2 mr-5">

        <Input id="search_input" placeholder="Search Todo or tag ..." onChange={(e) => { setSearchText(e.target.value) }} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <SunIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setTheme("light") }}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("dark") }}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("system") }}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <PlusCircledIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex items-center flex-col pt-3 pb-10 space-y-3">
            <DrawerHeader>
              <DrawerTitle>
                Add New Todo
              </DrawerTitle>
            </DrawerHeader>
            <TODOForm addTodo={addTodo} TodoList={TodoList}></TODOForm>
          </DrawerContent>
        </Drawer>

        <Sheet>
          <SheetTrigger asChild>

            <Button variant="outline" className="border-none shadow-none">
              <HamburgerMenuIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="text-2xl">Setting</SheetHeader>
            <SheetDescription>You can make some settings for AxisGTD here</SheetDescription>
            <ScrollArea className="h-[90vh] overflow-y-hidden pl-2 pr-2">
              <div className="mt-5 space-y-5 flex flex-col items-baseline">

                <div>
                  <p className="text-l font-semibold" >Set layout</p>
                  <p className="text-xs font-thin mb-2">Set the layout of the interface</p>
                  <Select defaultValue="axis"
                    value={layoutType}
                    onValueChange={(e) => { setLayoutType(e); localStorage.setItem("layout", e) }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Set layout"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axis">Axis Default (2*2) </SelectItem>
                      <SelectItem value="kanban">Kanban Mode (4*1) </SelectItem>
                      <SelectItem value="board">Big Board (1*4) </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-l font-semibold">Enable System Notifications</p>
                  <p className="text-xs font-thin mb-2">Make sure you have turned on notification permissions</p>
                  <Button variant="outline" onClick={
                    (e) => {
                      Notification.requestPermission().then((result) => {
                        if (result === "granted") {
                          toast("Permissions are already available", {
                            description: "AxisGTD has been granted system notification permissions"
                          })

                        }
                        else if (result === "denied") {
                          toast("The request was denied", {
                            description: "Please check your browser settings for AxisGTD to get notification permissions"
                          })
                        }
                      })

                    }
                  }>Enable</Button>
                </div>

                <div>
                  <p className="text-l font-semibold">Display Completed Todo</p>
                  <p className="text-xs font-thin mb-2">If you want to focus only on completed todos, you can turn this switch on</p>

                  <Switch checked={displayCompleted}
                    onCheckedChange={
                      (e) => {
                        setDisplayCompleted(e)
                      }} />
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
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline">Clear Data</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>Are you sure you want to clear the data?</DialogHeader>
                      <DialogDescription>The data is very important and cannot be recovered once it is cleaned. It is recommended that you back up the data in the settings before cleaning.</DialogDescription>
                      <DialogFooter>
                        <DialogClose>
                          <Button>Cancel</Button>
                        </DialogClose>
                        <DialogClose>
                          <Button variant="outline" onClick={() => {
                            setTODOList([])
                            localStorage.setItem("TODOList", "")
                            toast("Cleaned up", { description: "AxisGTD has cleared all data !" })
                          }}>Clear</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <p className="text-l font-semibold mb-2">About</p>
                  <p className="break-words font-light text-sm">
                    A minimalistic and serene personal office TodoList software that empowers you to prioritize todos effectively, with AxisGTD serving as a helpful aid. However, don&apos;t become overlydependent on AxisGTD.
                    It should be viewed as a mere component of your efficient office setup. Simply capture your todos within the app, set AxisGTD aside, and return to it later to mark off completed items once your work is finished.
                  </p>
                </div>
              </div>

              <div className="flex space-x-5 justify-between pl-2 pr-2 mb-2 mt-2">
                <HeartIcon className="size-5" />
                <FileTextIcon className="size-5" />
                <Link href="mailto:magician33333@gmail.com">
                  <EnvelopeClosedIcon className="size-5" />
                </Link>
                <Link href="https://github.com/magician333/AxisGTD" target="_blank">
                  <GitHubLogoIcon className="size-5" />
                </Link>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Navbar
