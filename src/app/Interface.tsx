import { Option } from '@/components/ui/MultipleSelector';


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
  completedSubTODO: (index: number, subIndex: number, sub: SubTodoItem) => void;
  delSubTodo: (index: number, subIndex: number) => void;
  reviseSubTodo: (index: number, subIndex: number, sub: SubTodoItem, text: string) => void;
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
  mainOverflow: string
}

export interface AreaProps {
  level: number;
  title: string;
  des: string;
  color: string;
}
