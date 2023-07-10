import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

jest.mock('./newUser', () => ({
  newUser: jest.fn(() =>
    Promise.resolve({
      data: {
        getAllUsers: [
          { id: '1', username: 'testuser1', age: 25 },
          { id: '2', username: 'testuser2', age: 30 },
        ],
      },
    })
  ),
}));

describe('App component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });
  it('renders a form with two input fields and two buttons', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('input').length).toBe(2);
    expect(container.querySelectorAll('button').length).toBe(2);
  });
  it('fetches and displays a list of users when the get button is clicked', async () => {
    const { getByText, findAllByText } = render(<App />);
    fireEvent.click(getByText(/get/i));
  
    const users = await findAllByText(/testuser/i);
    expect(users.length).toBe(2);
  });
});
