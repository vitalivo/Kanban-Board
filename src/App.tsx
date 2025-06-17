import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import TaskDetail from './components/TaskDetail/TaskDetail';
import Footer from './components/Footer/Footer';
import { TaskProvider } from './contexts/TaskContext';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </TaskProvider>
  );
};

export default App;
