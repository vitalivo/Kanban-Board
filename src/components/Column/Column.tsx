import React, { useState } from 'react';
import Task from '../Task/Task';
import { useTaskContext } from '../../contexts/TaskContext';
import { Column as ColumnType, Task as TaskType } from '../../types';
import './Column.css';

interface ColumnProps {
  column: ColumnType;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const { state, addTask, moveTask } = useTaskContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const getPreviousColumn = () => {
    const columnOrder = ['backlog', 'ready', 'in-progress', 'finished'];
    const currentIndex = columnOrder.indexOf(column.id);
    if (currentIndex > 0) {
      return state.columns.find((col: ColumnType) => col.id === columnOrder[currentIndex - 1]);
    }
    return null;
  };

  const previousColumn = getPreviousColumn();
  const canAddTasks = column.id === 'backlog' || (previousColumn && previousColumn.tasks.length > 0);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSubmit = () => {
    if (column.id === 'backlog' && newTaskName.trim()) {
      addTask(column.id, newTaskName.trim());
      setNewTaskName('');
      setIsAdding(false);
    } else if (selectedTaskId && previousColumn) {
      moveTask(selectedTaskId, previousColumn.id, column.id);
      setSelectedTaskId('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTaskName('');
    setSelectedTaskId('');
  };

  return (
    <div className="column">
      <h2 className="column__title">{column.title}</h2>
      
      <div className="column__tasks">
        {column.tasks.map((task: TaskType) => (
          <Task key={task.id} task={task} />
        ))}
      </div>

      {isAdding ? (
        <div className="column__input-container">
          {column.id === 'backlog' ? (
            <input
              type="text"
              className="column__input"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task title"
              autoFocus
            />
          ) : (
            <select
              className="column__select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              autoFocus
            >
              <option value="">Select a task</option>
              {previousColumn?.tasks.map((task: TaskType) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          )}
          
          <div className="column__button-group">
            <button
              className="column__submit-button"
              onClick={handleSubmit}
              disabled={column.id === 'backlog' ? !newTaskName.trim() : !selectedTaskId}
            >
              Submit
            </button>
            <button className="column__cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="column__add-button"
          onClick={handleAddClick}
          disabled={!canAddTasks}
        >
          + Add card
        </button>
      )}
    </div>
  );
};

export default Column;