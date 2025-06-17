import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../../contexts/TaskContext';
import './TaskDetail.css';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, updateTask } = useTaskContext();

  const [task, setTask] = useState(getTask(id || ''));
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(task?.description || '');

  // Используем useCallback для handleCancelEdit, чтобы избежать предупреждения
  const handleCancelEdit = useCallback(() => {
    setDescription(task?.description || '');
    setIsEditingDescription(false);
  }, [task?.description]);

  // Обновление задачи при изменении id
  useEffect(() => {
    const currentTask = getTask(id || '');
    if (currentTask) {
      setTask(currentTask);
      setDescription(currentTask.description);
    }
  }, [id, getTask]);

  // Изменение title страницы - для всех случаев
  useEffect(() => {
    if (task) {
      document.title = `${task.name} - Kanban Board`;
    } else {
      document.title = 'Task Not Found - Kanban Board';
    }
    
    // Возвращаем оригинальный title при размонтировании компонента
    return () => {
      document.title = 'Awesome Kanban Board';
    };
  }, [task]);

  // Обработка нажатия Escape для отмены редактирования
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditingDescription) {
        handleCancelEdit();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isEditingDescription, handleCancelEdit]);

  const handleSaveDescription = () => {
    // Проверяем, что task существует
    if (!task) return;
    
    updateTask(task.id, { description });
    setIsEditingDescription(false);
    // Обновляем локальное состояние задачи с правильной типизацией
    setTask(prevTask => {
      if (!prevTask) return prevTask;
      return { ...prevTask, description };
    });
  };

  // Обработка сохранения по Ctrl+Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'Enter') {
      handleSaveDescription();
    }
  };

  if (!task) {
    return (
      <div className="task-detail">
        <div className="task-detail__container">
          <div className="task-detail__close" onClick={() => navigate('/')}>
            ✕
          </div>
          <h1 className="task-detail__title">Task not found</h1>
          <p className="task-detail__not-found-text">
            The task you're looking for doesn't exist or has been deleted.
          </p>
          <button 
            className="task-detail__back-button"
            onClick={() => navigate('/')}
          >
            Back to board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail">
      <div className="task-detail__container">
        <div className="task-detail__close" onClick={() => navigate('/')}>
          ✕
        </div>
        
        <h1 className="task-detail__title">{task.name}</h1>
        
        <div className="task-detail__content">
          <div className="task-detail__description-header">
            <h2 className="task-detail__description-title">Description</h2>
            {!isEditingDescription && (
              <button
                className="task-detail__edit-button"
                onClick={() => setIsEditingDescription(true)}
                title="Edit description"
              >
                ✎
              </button>
            )}
          </div>

          {isEditingDescription ? (
            <div className="task-detail__edit-container">
              <textarea
                className="task-detail__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a description..."
                autoFocus
              />
              <div className="task-detail__button-group">
                <button
                  className="task-detail__save-button"
                  onClick={handleSaveDescription}
                  title="Save (Ctrl+Enter)"
                >
                  Save
                </button>
                <button
                  className="task-detail__cancel-button"
                  onClick={handleCancelEdit}
                  title="Cancel (Escape)"
                >
                  Cancel
                </button>
              </div>
              <div className="task-detail__hint">
                Press Ctrl+Enter to save, Escape to cancel
              </div>
            </div>
          ) : (
            <div
              className={`task-detail__description ${
                !task.description ? 'task-detail__description--empty' : ''
              }`}
              onClick={() => setIsEditingDescription(true)}
              title="Click to edit description"
            >
              {task.description || 'This task has no description'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;