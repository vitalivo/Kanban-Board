import React from 'react';
import { Link } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import './Task.css';

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  return (
    <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
      <div className="task">
        <h3 className="task__title">{task.name}</h3>
      </div>
    </Link>
  );
};

export default Task;