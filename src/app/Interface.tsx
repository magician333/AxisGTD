import { Option } from "@/components/ui/MultipleSelector";
import React from "react";

export interface TodoItem {
  index: number;
  text: string;
  completed: boolean;
  level: number;
  tags: string[];
  pin: boolean;
  deadline: string;
  createdtime: number;
  completedtime: number;
  sub: SubTodoItem[];
}

export interface TodoProps {
  todo: TodoItem;
  tagOptions: Option[];
  droppedLevel: number;
  droppedIndex: number;
  completedTODO: (index: number) => void;
  removeTODO: (index: number) => void;
  pinTodo: (index: number) => void;
  reviseTodo: (index: number, text: string) => void;
  addTag: (index: number, tags: string[]) => void;
  reLevel: (index: number, targetLevel: number) => void;
  reSort: (index: number, targetIndex: number) => void;
  setDeadline: (index: number, deadline: string) => void;
  addSub: (index: number, sub: SubTodoItem) => void;
  completedSubTODO: (index: number, subIndex: number) => void;
  delSubTodo: (index: number, subIndex: number) => void;
  reviseSubTodo: (
    index: number,
    subIndex: number,
    text: string
  ) => void;
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
  lang: any;
  updateStorage: (todolist: TodoItem[]) => void;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setDisplayLang: React.Dispatch<React.SetStateAction<string>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TODOFormProps {
  addTodo: (index: number, text: string, level: number) => void;
  TodoList: TodoItem[];
  lang: any;
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
