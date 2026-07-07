import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task board filters and due date controls', () => {
  window.history.pushState({}, '', '/tasks');
  render(<App />);

  expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/filter by priority/i)).toBeInTheDocument();
});
