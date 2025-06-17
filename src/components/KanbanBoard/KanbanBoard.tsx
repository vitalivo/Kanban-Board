import React from 'react';
import Column from '../Column/Column';
import { useTaskContext } from '../../contexts/TaskContext';
import { Column as ColumnType } from '../../types';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const { state } = useTaskContext();

  return (
    <main className="board">
      {state.columns.map((column: ColumnType) => (
        <Column key={column.id} column={column} />
      ))}
    </main>
  );
};

export default KanbanBoard;