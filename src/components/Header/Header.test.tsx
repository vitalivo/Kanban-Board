import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders header with title', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  
  const titleElement = screen.getByText(/Awesome Kanban Board/i);
  expect(titleElement).toBeInTheDocument();
});

test('toggles user menu on click', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  
  const userButton = screen.getByText('U').closest('div')?.parentElement;
  expect(userButton).toBeInTheDocument();
  
  if (userButton) {
    fireEvent.click(userButton);
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    
    fireEvent.click(userButton);
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
  }
});