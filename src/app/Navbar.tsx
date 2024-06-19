"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  CalendarIcon,
  Crosshair1Icon,
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  HeartIcon,
  MoonIcon,
  PlusCircledIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  NavProps,
  TODOFormProps,
  TodoItem,
} from "./Interface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import localForage from "localforage";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "./CalendarView";
import TodoOverview from "./TodoOverView";

function TODOForm({ addTodo, TodoList, lang }: TODOFormProps) {
  const [value, setValue] = useState<string>("");
  const [level, setLevel] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let lastindex = 0;
    e.preventDefault();
    if (!value) return;
    if (level === 0) {
      toast(lang["toast_notodotype_title"], {
        description: lang["toast_notodotype_content"],
      });
      return;
    }
    if (TodoList.length === 0) {
      lastindex = 1;
    } else {
      lastindex = TodoList[TodoList.length - 1].index + 1;
    }
    addTodo(lastindex, value, level);
    setValue("");
  };

  useEffect(() => {
    localForage.config({
      driver: localForage.INDEXEDDB,
      storeName: "AxisGTD",
      version: 1,
      description: "database for AisGTD",
    });
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <div className="flex space-y-2 justify-between flex-col items-baseline ">
        <Label htmlFor="entry_todo" className="break-normal w-[14vh]">
          {lang["addtodo_content_label"]}:{" "}
        </Label>
        <Input
          id="entry_todo"
          className="w-[30vh]"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={lang["addtodo_content_placeholder"]}
        />
      </div>
      <div className="flex space-y-2 justify-between flex-col items-baseline ">
        <Label htmlFor="todo_select" className="break-normal w-[14vh]">
          {lang["addtodo_type_label"]}:{" "}
        </Label>
        <div id="todo_select" className="w-10/12">
          <Select onValueChange={(e) => setLevel(Number(e))}>
            <SelectTrigger className="space-x-2 w-[30vh]">
              <Crosshair1Icon />
              <SelectValue placeholder={lang["addtodo_type_placeholder"]}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">{lang["addtodo_type_name_1"]}</SelectItem>
                <SelectItem value="2">{lang["addtodo_type_name_2"]}</SelectItem>
                <SelectItem value="3">{lang["addtodo_type_name_3"]}</SelectItem>
                <SelectItem value="4">{lang["addtodo_type_name_4"]}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DrawerClose className="flex  items-center justify-center" asChild>
        <Button type="submit" variant="outline">
          {lang["addtodo_button"]}
        </Button>
      </DrawerClose>
    </form>
  );
}


function Navbar({
  addTodo,
  TodoList,
  updateStorage,
  setTODOList,
  setSearchText,
  setLayoutType,
  layoutType,
  setDisplayCompleted,
  displayCompleted,
  displayLang,
  setDisplayLang,
  lang
}: NavProps) {
  const { setTheme } = useTheme();
  const [fileContent, setFileContent] = useState<string>("");
  const [dataType, setDataType] = useState<string>("import");
  const [dataImportInfo, setDataImportInfo] = useState<string>("");
  const [secTodoList, setSecTodoList] = useState<TodoItem[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setFileContent(e.target?.result as string);
        } else {
          console.error("Failed to read file content.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileupload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSecTodoList(JSON.parse(fileContent) as TodoItem[]);
      if (TodoList !== secTodoList) {
        setDataImportInfo(
          lang["setting_importdata_dialog_info"]
        );
      }
    } catch {
      toast(lang["toast_nouploadfile_title"], { description: lang["toast_nouploadfile_content"] });
    }
  };

  const ImportData = () => {
    if (dataType === "original") {
      updateStorage([])
      updateStorage(TodoList);
    } else {
      updateStorage([])
      updateStorage(secTodoList);
    }
    setSecTodoList([]);
  };

  useLayoutEffect(() => {
    const layoutStorage = localStorage.getItem("layout");
    if (layoutStorage) {
      setLayoutType(layoutStorage);
    } else {
      setLayoutType("axis");
    }
  }, []);

  return (
    <div className="w-screen h-[6vh] shadow flex items-center justify-between bg-white dark:bg-zinc-950 dark:border-b">
      <div className="w-1/12 ml-5">
        <Image
          src="/icons/logo.svg"
          alt="Logo"
          width={156.317}
          height={24.1167}
        />
      </div>
      <div className="flex items-center space-x-2 mr-5">
        <Input
          id="search_input"
          placeholder={lang["search_placeholder"]}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <SunIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{lang["theme_label"]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setTheme("light");
              }}
            >
              {lang["theme_light"]}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme("dark");
              }}
            >
              {lang["theme_dark"]}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme("system");
              }}
            >
              {lang["theme_system"]}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <CalendarIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex items-center flex-col pt-3 pb-10 space-y-3">
            <DrawerHeader>
              <DrawerTitle>{lang["calendar_title"]}</DrawerTitle>
              <DrawerDescription>{lang["calendar_des"]}</DrawerDescription>
            </DrawerHeader>
            <CalendarView TodoList={TodoList} lang={lang} />
          </DrawerContent>
        </Drawer>


        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <PlusCircledIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex items-center flex-col pt-3 pb-10 space-y-3">
            <DrawerHeader>
              <DrawerTitle>{lang["addtodo_title"]}</DrawerTitle>
            </DrawerHeader>
            <TODOForm addTodo={addTodo} TodoList={TodoList} lang={lang}></TODOForm>
          </DrawerContent>
        </Drawer>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <HamburgerMenuIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="text-2xl">{lang["setting_title"]}</SheetHeader>
            <SheetDescription>
              {lang["setting_des"]}
            </SheetDescription>
            <ScrollArea className="h-[90vh] overflow-y-hidden">
              <div className="mt-5 space-y-5 flex flex-col items-baseline ml-4 mr-4">
                <div>
                  <p className="text-l font-semibold">{lang["setting_setlayout_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_setlayout_des"]}
                  </p>
                  <Select
                    defaultValue="axis"
                    value={layoutType}
                    onValueChange={(e) => {
                      setLayoutType(e);
                      localStorage.setItem("layout", e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set layout"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axis">{lang["setting_setlayout_name_1"]}</SelectItem>
                      <SelectItem value="kanban">{lang["setting_setlayout_name_2"]}</SelectItem>
                      <SelectItem value="board">{lang["setting_setlayout_name_3"]}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-l font-semibold">{lang["setting_setlanguage_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_setlanguage_des"]}
                  </p>
                  <Select
                    defaultValue="en_US"
                    value={displayLang}
                    onValueChange={(e) => {
                      setDisplayLang(e);
                      localStorage.setItem("language", e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={lang["setting_setlanguage_label"]}></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_US">English</SelectItem>
                      <SelectItem value="zh_CN">简体中文</SelectItem>
                      <SelectItem value="de_DE">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-l font-semibold">
                    {lang["setting_notification_label"]}
                  </p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_notification_des"]}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      Notification.requestPermission().then((result) => {
                        if (result === "granted") {
                          toast(lang["toast_notification_premission_available_title"], {
                            description:
                              lang["toast_notification_premission_available_content"],
                          });
                        } else if (result === "denied") {
                          toast(lang["toast_notification_premission_denied_title"], {
                            description:
                              lang["toast_notification_premission_denied_content"]
                          });
                        }
                      });
                    }}
                  >
                    {lang["setting_notification_button"]}
                  </Button>
                </div>

                <div>
                  <p className="text-l font-semibold">{lang["setting_displaycompleted_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_displaycompleted_des"]}
                  </p>

                  <Switch
                    checked={displayCompleted}
                    onCheckedChange={(e) => {
                      setDisplayCompleted(e);
                      localStorage.setItem(
                        "displayCompleted",
                        (!displayCompleted).toString()
                      );
                    }}
                  />
                </div>

                <div>
                  <p className="text-l font-semibold">{lang["setting_exportdata_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_exportdata_des"]}
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const date = Date.now().toString();
                      const blob = new Blob([JSON.stringify(TodoList)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "AxisGTD-" + date + ".json";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    {lang["setting_exportdata_button"]}
                  </Button>
                </div>

                <div>
                  <p className="text-l font-semibold">{lang["setting_importdata_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_importdata_des"]}
                  </p>
                  <div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDataType("original");
                              setSecTodoList([]);
                            }}
                          >
                            {lang["setting_importdata_button"]}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>{lang["setting_importdata_dialog_title"]}</DialogHeader>
                          <DialogDescription>
                            {lang["setting_importdata_dialog_des"]}
                          </DialogDescription>
                          <div className="flex flex-col w-full">
                            <form
                              onSubmit={handleFileupload}
                              className="flex space-x-2"
                            >
                              <Input
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                              />
                              <Button
                                variant="outline"
                                type="submit"
                                onClick={() => {
                                  handleFileupload;
                                }}
                              >
                                {lang["setting_importdata_dialog_upload_button"]}
                              </Button>
                            </form>
                            <Tabs
                              onValueChange={(e) => setDataType(e)}
                              defaultValue="original"
                              className="w-full pt-2"
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="original">
                                  {lang["setting_importdata_dialog_tab_original"]}
                                </TabsTrigger>
                                <TabsTrigger value="import">
                                  {lang["setting_importdata_dialog_tab_import"]}
                                </TabsTrigger>
                              </TabsList>

                              <p className="font-light text-sm">
                                {dataImportInfo}
                              </p>
                              <TabsContent value="original" className="w-full">
                                <ScrollArea className="h-[30vh] w-full">
                                  {TodoList.map((item: TodoItem, index) => {
                                    return (
                                      <div key={index} className="w-[24vw]">
                                        <TodoOverview item={item} lang={lang} />
                                      </div>
                                    );
                                  })}
                                </ScrollArea>
                              </TabsContent>
                              <TabsContent value="import" className="w-full">
                                <ScrollArea className="h-[30vh] w-full">
                                  {secTodoList.map((item: TodoItem, index) => {
                                    return (
                                      <div key={index} className="w-[24vw]">
                                        <TodoOverview item={item} lang={lang} />
                                      </div>
                                    );
                                  })}
                                </ScrollArea>
                              </TabsContent>
                            </Tabs>
                          </div>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                ImportData();
                              }}
                            >
                              {lang["setting_importdata_dialog_button"]}
                            </Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-l font-semibold">{lang["setting_cleardata_label"]}</p>
                  <p className="text-xs font-thin mb-2">
                    {lang["setting_cleardata_des"]}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">{lang["setting_cleardata_button"]}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        {lang["setting_cleardata_dialog_title"]}
                      </DialogHeader>
                      <DialogDescription>
                        {lang["setting_cleardata_dialog_des"]}
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>{lang["setting_cleardata_dialog_cancelbutton"]}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setTODOList([]);
                              localForage.setItem("TODOList", []);
                              toast(lang["toast_clean_title"], {
                                description: lang["toast_clean_content"],
                              });
                            }}
                          >
                            {lang["setting_cleardata_dialog_clearbutton"]}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <p className="text-l font-semibold mb-2">{lang["setting_about_label"]}</p>
                  <p className="break-words font-light text-sm whitespace-pre-wrap">
                    {lang["setting_about_des"]}
                  </p>
                  <br />
                  <p>
                    <b>{lang["setting_note_label"]}</b>
                    <br />
                    {lang["setting_note_des"]}
                  </p>
                </div>
              </div>

              <div className="flex space-x-5 justify-between pl-2 pr-2 mb-2 mt-2">
                <Dialog>
                  <DialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HeartIcon className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent>{lang["setting_donate_dialog_title"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{lang["setting_donate_dialog_title"]}</DialogTitle>
                      <DialogDescription>
                        {lang["setting_donate_dialog_des"]}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-5">
                      <Image
                        src="/Donate_Paypal.png"
                        alt="Donate_Paypal"
                        width={200}
                        height={200}
                      />

                      <Image
                        src="/Donate_Wechat.png"
                        alt="Donate_Wechat"
                        width={200}
                        height={200}
                      />
                    </div>
                    <DialogClose>
                      <Button variant="outline">{lang["setting_donate_dialog_button"]}</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FileTextIcon className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent>{lang["setting_privacypolicy_dialog_title"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{lang["setting_privacypolicy_dialog_title"]}</DialogTitle>
                      <DialogDescription>
                        {lang["setting_privacypolicy_dialog_des"]}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-center space-y-5">
                      <ScrollArea className="h-[30vh] p-2">
                        <p className="whitespace-pre-wrap">
                          {lang["setting_privacypolicy_dialog_content"]}
                        </p>
                      </ScrollArea>
                    </div>
                    <DialogClose>
                      <Button variant="outline">{lang["setting_privacypolicy_dialog_button"]}</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <EnvelopeClosedIcon />
                        </TooltipTrigger>
                        <TooltipContent>{lang["setting_contact_dialog_title"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{lang["setting_contact_dialog_title"]}</DialogTitle>
                      <DialogDescription>
                        {lang["setting_contact_dialog_des"]}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-center space-y-5">
                      <Link
                        href="mailto:magician33333@gmail.com"
                        className="flex space-x-3 items-center"
                      >
                        <EnvelopeClosedIcon className="size-5" />
                        <Label>{lang["setting_contact_dialog_email"]} : magician333333@gmail.com</Label>
                      </Link>
                      <Link
                        href="https://github.com/magician333/AxisGTD"
                        target="_blank"
                        className="flex space-x-3 items-center"
                      >
                        <GitHubLogoIcon className="size-5" />
                        <Label>
                          Github : https://github.com/magician333/AxisGTD
                        </Label>
                      </Link>
                    </div>
                    <DialogClose>
                      <Button variant="outline">{lang["setting_contact_dialog_button"]}</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Navbar;
