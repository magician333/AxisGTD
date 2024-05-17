import { Option } from '@/components/ui/MultipleSelector';


export interface TodoItem {
  index: number;
  text: string;
  completed: boolean;
  level: number;
  tags: string[];
  deadline: string;
  completedtime: number;
}

export interface TodoProps {
  index: number;
  todo: TodoItem;
  tagOptions: Option[];
  completedTODO: (index: number) => void;
  removeTODO: (index: number) => void;
  reviseTodo: (index: number, text: string) => void;
  addTag: (index: number, tags: string[]) => void;
  reLevel: (index: number, targetLevel: number) => void;
  setDeadline: (index: number, deadline: string) => void;
}


export interface NavProps {
  addTodo: (index: number, text: string, level: number) => void;
  TodoList: TodoItem[];
  layoutType: string;
  displayCompleted: boolean;
  setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setLayoutType: React.Dispatch<React.SetStateAction<string>>;
  setDisplayCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TODOFormProps {
  addTodo: (index: number, text: string, level: number) => void;
  TodoList: TodoItem[];
}

export interface LayoutClasses {
  boardGird: string;
  boardSize: string;
  scrollareaHeight: string;
  todoSize: string;
  todoGrid: string;
  colorbrandWidth: string;
}
