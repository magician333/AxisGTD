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
  lang: any;
  pushData: () => void;
  updateStorage: (todolist: TodoItem[]) => void;
  removeTodo: (indexList: number[]) => void;
  restoreTodo: (indexList: number[]) => void;
  pullData: () => void;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setDisplayLang: React.Dispatch<React.SetStateAction<string>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setSyncUrl: React.Dispatch<React.SetStateAction<string>>;
}
export interface SidebarProps {
  TodoList: TodoItem[];
  lang: any;
  displayLang: string;
  layoutType: string;
  displayCompleted: boolean;
  syncUrl: string;
  updateStorage: (todolist: TodoItem[]) => void;
  pushData: () => void;
  pullData: () => void;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayLang: React.Dispatch<React.SetStateAction<string>>;
  setSyncUrl: React.Dispatch<React.SetStateAction<string>>;
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
