import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const currentTask = getTask(id || '');
    if (currentTask) {
      setTask(currentTask);
      setDescription(currentTask.description);
    }
  }, [id, getTask]);

  if (!task) {
    return (
      <div className="task-detail">
        <div className="task-detail__container">
          <h1>Task not found</h1>
          <button onClick={() => navigate('/')}>Back to board</button>
        </div>
      </div>
    );
  }

  const handleSaveDescription = () => {
    updateTask(task.id, { description });
    setIsEditingDescription(false);
    setTask({ ...task, description });
  };

  const handleCancelEdit = () => {
    setDescription(task.description);
    setIsEditingDescription(false);
  };

  return (
    <div className="task-detail">
      <div className="task-detail__container">
        <div className="task-detail__close" onClick={() => navigate('/')}>
          ✕
        </div>
        
        <h1 className="task-detail__title">{task.name}</h1>
        
        <div>
          <div className="task-detail__description-header">
            <h2 className="task-detail__description-title">Description</h2>
            {!isEditingDescription && (
              <button
                className="task-detail__edit-button"
                onClick={() => setIsEditingDescription(true)}
              >
                ✎
              </button>
            )}
          </div>

          {isEditingDescription ? (
            <div>
              <textarea
                className="task-detail__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                autoFocus
              />
              <div className="task-detail__button-group">
                <button
                  className="task-detail__save-button"
                  onClick={handleSaveDescription}
                >
                  Save
                </button>
                <button
                  className="task-detail__cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`task-detail__description ${
                !task.description ? 'task-detail__description--empty' : ''
              }`}
              onClick={() => setIsEditingDescription(true)}
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