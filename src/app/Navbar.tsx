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
  HamburgerMenuIcon,
  MoonIcon,
  PlusCircledIcon,
  SunIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { NavProps } from "./Interface";
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
import localForage from "localforage";
import Image from "next/image";
import CalendarView from "./CalendarView";
import Trash from "./Trash";
import Sidebar from "./Sidebar";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

function Navbar({
  addTodo,
  TodoList,
  removeTodo,
  restoreTodo,
  updateStorage,
  setTODOList,
  setSearchText,
  setLayoutType,
  layoutType,
  setDisplayCompleted,
  displayCompleted,
  displayLang,
  setDisplayLang,
  syncUrl,
  setSyncUrl,
  pushData,
  pullData,
  lang,
}: NavProps) {
  const { setTheme } = useTheme();
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
              <TrashIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex items-center flex-col pt-3 pb-10 space-y-3">
            <DrawerHeader>
              <DrawerTitle>{lang["trash_title"]}</DrawerTitle>
              <DrawerDescription>{lang["trash_des"]}</DrawerDescription>
            </DrawerHeader>
            <Trash
              TodoList={TodoList}
              lang={lang}
              removeTodo={removeTodo}
              restoreTodo={restoreTodo}
            />
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
                      <SelectValue
                        placeholder={lang["addtodo_type_placeholder"]}
                      ></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">
                          {lang["addtodo_type_name_1"]}
                        </SelectItem>
                        <SelectItem value="2">
                          {lang["addtodo_type_name_2"]}
                        </SelectItem>
                        <SelectItem value="3">
                          {lang["addtodo_type_name_3"]}
                        </SelectItem>
                        <SelectItem value="4">
                          {lang["addtodo_type_name_4"]}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerClose
                className="flex  items-center justify-center"
                asChild
              >
                <Button type="submit" variant="outline">
                  {lang["addtodo_button"]}
                </Button>
              </DrawerClose>
            </form>
          </DrawerContent>
        </Drawer>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-none shadow-none">
              <HamburgerMenuIcon className="w-[1rem] h-[1rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="text-2xl">
              {lang["setting_title"]}
            </SheetHeader>
            <SheetDescription>{lang["setting_des"]}</SheetDescription>
            <Sidebar
              lang={lang}
              TodoList={TodoList}
              updateStorage={updateStorage}
              setLayoutType={setLayoutType}
              setTODOList={setTODOList}
              layoutType={layoutType}
              displayCompleted={displayCompleted}
              displayLang={displayLang}
              setDisplayCompleted={setDisplayCompleted}
              setDisplayLang={setDisplayLang}
              syncUrl={syncUrl}
              setSyncUrl={setSyncUrl}
              pushData={pushData}
              pullData={pullData}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Navbar;
