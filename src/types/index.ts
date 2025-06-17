export interface Task {
  id: string;
  name: string;
  description: string;
}

export interface Column {
  id: 'backlog' | 'ready' | 'in-progress' | 'finished';
  title: string;
  tasks: Task[];
}

export interface KanbanState {
  columns: Column[];
}
export {};