import React from 'react';
import { useTaskContext } from '../../contexts/TaskContext';
import { Column } from '../../types';
import './Footer.css';

const Footer: React.FC = () => {
  const { state } = useTaskContext();

  const backlogTasks = state.columns.find((col: Column) => col.id === 'backlog')?.tasks.length || 0;
  const finishedTasks = state.columns.find((col: Column) => col.id === 'finished')?.tasks.length || 0;

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__tasks">
          <span className="footer__task-count">Active tasks: {backlogTasks}</span>
          <span className="footer__task-count">Finished tasks: {finishedTasks}</span>
        </div>
        <div className="footer__author">
          Kanban board by Vitaly, 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer;