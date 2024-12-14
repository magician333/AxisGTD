import { Option } from "@/components/ui/MultipleSelector";
import React from "react";

export interface TodoItem {
  index: number;
  text: string;
  completed: boolean;
  level: number;
  tags: string[];
  pin: boolean;
  isRemind: boolean;
  deadline: string;
  ahead: number;
  createdtime: number;
  completedtime: number;
  sub: SubTodoItem[];
  trash: boolean;
}

export interface TodoProps {
  todo: TodoItem;
  tagOptions: Option[];
  droppedLevel: number;
  droppedIndex: number;
  completedTODO: (index: number) => void;
  trashTodo: (index: number) => void;
  pinTodo: (index: number) => void;
  reviseTodo: (index: number, text: string) => void;
  addTag: (index: number, tags: string[]) => void;
  reLevel: (index: number, targetLevel: number) => void;
  setDeadline: (index: number, deadline: string) => void;
  setAhead: (index: number, ahead: string) => void;
  addSub: (index: number, sub: SubTodoItem) => void;
  completedSubTODO: (index: number, subIndex: number) => void;
  delSubTodo: (index: number, subIndex: number) => void;
  restoreTodo: (indexList: number[]) => void;
  reviseSubTodo: (index: number, subIndex: number, text: string) => void;
  lang: any;
}

export interface SubTodoItem {
  index: number;
  text: string;
  completed: boolean;
}

export interface NavProps {
  addTodo: (index: number, text: string, level: number) => void;
  TodoList: TodoItem[];
  layoutType: string;
  displayLang: string;
  displayCompleted: boolean;
  syncUrl: string;
  hideFunc: HideNavProps;
  tagOptions: Option[];
  lang: any;
  pushData: () => void;
  updateStorage: (todolist: TodoItem[]) => void;
  removeTodo: (indexList: number[]) => void;
  restoreTodo: (indexList: number[]) => void;
  pullData: (
    todolistData: TodoItem[],
    configData: syncConfigProps,
    time: number
  ) => void;
  toggleDisplayCompleted: (status: boolean) => void;

  setTagOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setDisplayLang: React.Dispatch<React.SetStateAction<string>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setSyncUrl: React.Dispatch<React.SetStateAction<string>>;
  syncID: string;
  setSyncID: React.Dispatch<React.SetStateAction<string>>;
  setHideFunc: React.Dispatch<React.SetStateAction<HideNavProps>>;
}
export interface SidebarProps {
  TodoList: TodoItem[];
  lang: any;
  displayLang: string;
  layoutType: string;
  displayCompleted: boolean;
  hideFunc: HideNavProps;
  tagOptions: Option[];
  updateStorage: (todolist: TodoItem[]) => void;
  toggleDisplayCompleted: (status: boolean) => void;
  setTagOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  setHideFunc: React.Dispatch<React.SetStateAction<HideNavProps>>;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayLang: React.Dispatch<React.SetStateAction<string>>;
}

export interface LayoutClasses {
  boardGird: string;
  boardSize: string;
  scrollareaHeight: string;
  todoSize: string;
  todoGrid: string;
  colorbrandWidth: string;
  mainOverflow: string;
}

export interface AreaProps {
  level: number;
  title: string;
  des: string;
  color: string;
  displayCompleted: boolean;
}

export interface TodoOverviewProps {
  item: TodoItem;
  lang: any;
}

export interface FooterProps {
  lang: any;
}

export interface CalendarViewProps {
  TodoList: TodoItem[];
  lang: any;
}

export interface TrashProps {
  TodoList: TodoItem[];
  lang: any;
  removeTodo: (indexList: number[]) => void;
  restoreTodo: (indexList: number[]) => void;
}

export interface SyncViewProps {
  TodoList: TodoItem[];
  syncUrl: string;
  syncID: string;
  setSyncID: React.Dispatch<React.SetStateAction<string>>;
  setSyncUrl: React.Dispatch<React.SetStateAction<string>>;
  lang: any;
  addTodo: (index: number, text: string, level: number) => void;
  updateStorage: (todolist: TodoItem[]) => void;
  pushData: () => void;
  pullData: (
    todolistData: TodoItem[],
    configData: syncConfigProps,
    time: number
  ) => void;
}

export interface historyProps {
  todolist: string;
  config: string;
  time: number;
}

export interface syncConfigProps {
  language: string;
  layout: string;
  displayCompleted: boolean;
  hideNav: HideNavProps;
  tags: Option[];
}

export interface HideNavProps {
  theme: boolean;
  calendar: boolean;
  sync: boolean;
  trash: boolean;
}

export interface AreaDisplayCompletedProps {
  level: number;
  status: boolean;
}
