import { Option } from '@/components/ui/MultipleSelector';


export interface TodoItem {
    text: string;
    completed: boolean;
    level: number;
    tags: Option[];
}

export interface TodoProps {
    index: number;
    todo: TodoItem;
    tagOptions: Option[];
    completedTODO: (index: number) => void;
    removeTODO: (index: number) => void;
    reviseTodo: (index: number, text: string) => void;
    addTag: (index: number, tags: Option[]) => void
}


export interface TODOFormProps {
    addTodo: (text: string, level: number) => void;
    TodoList: TodoItem[];
    setTODOList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}