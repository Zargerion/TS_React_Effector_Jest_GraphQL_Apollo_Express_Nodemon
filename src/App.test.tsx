import { render } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo'

describe('App component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>,
      div
    );
  });
  it('renders a form with two input fields and two buttons', () => {
    const { container } = render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );
    expect(container.querySelectorAll('input').length).toBeGreaterThan(2);
    expect(container.querySelectorAll('button').length).toBeGreaterThan(2);
  });
});
