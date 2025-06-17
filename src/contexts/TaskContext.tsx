import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, Column, KanbanState } from '../types';

// Начальное состояние
const initialState: KanbanState = {
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: [],
    },
    {
      id: 'ready',
      title: 'Ready',
      tasks: [],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [],
    },
    {
      id: 'finished',
      title: 'Finished',
      tasks: [],
    },
  ],
};

// Типы действий
type TaskAction =
  | { type: 'ADD_TASK'; payload: { columnId: string; task: Task } }
  | { type: 'MOVE_TASK'; payload: { taskId: string; fromColumnId: string; toColumnId: string } }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'LOAD_STATE'; payload: KanbanState };

// Редьюсер для управления состоянием
function taskReducer(state: KanbanState, action: TaskAction): KanbanState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        columns: state.columns.map((column: Column) =>
          column.id === action.payload.columnId
            ? { ...column, tasks: [...column.tasks, action.payload.task] }
            : column
        ),
      };

    case 'MOVE_TASK':
      const { taskId, fromColumnId, toColumnId } = action.payload;
      const task = state.columns
        .find((col: Column) => col.id === fromColumnId)
        ?.tasks.find((t: Task) => t.id === taskId);

      if (!task) return state;

      return {
        ...state,
        columns: state.columns.map((column: Column) => {
          if (column.id === fromColumnId) {
            return { ...column, tasks: column.tasks.filter((t: Task) => t.id !== taskId) };
          }
          if (column.id === toColumnId) {
            return { ...column, tasks: [...column.tasks, task] };
          }
          return column;
        }),
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        columns: state.columns.map((column: Column) => ({
          ...column,
          tasks: column.tasks.map((task: Task) =>
            task.id === action.payload.taskId
              ? { ...task, ...action.payload.updates }
              : task
          ),
        })),
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// Тип контекста
interface TaskContextType {
  state: KanbanState;
  addTask: (columnId: string, name: string) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  getTask: (taskId: string) => Task | undefined;
}

// Создание контекста
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Провайдер контекста
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('kanban-tasks');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Сохранение в localStorage при изменении состояния
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(state));
  }, [state]);

  // Функции для работы с задачами
  const addTask = (columnId: string, name: string) => {
    const task: Task = {
      id: Date.now().toString(),
      name,
      description: '',
    };
    dispatch({ type: 'ADD_TASK', payload: { columnId, task } });
  };

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, fromColumnId, toColumnId } });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  };

  const getTask = (taskId: string): Task | undefined => {
    for (const column of state.columns) {
      const task = column.tasks.find((t: Task) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  return (
    <TaskContext.Provider value={{ state, addTask, moveTask, updateTask, getTask }}>
      {children}
    </TaskContext.Provider>
  );
}

// Хук для использования контекста
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}