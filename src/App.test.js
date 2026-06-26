import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the jungle adventure home screen', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  render(<App />);

  expect(screen.getByRole('heading', { name: /math quest/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /jungle adventure!/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /start adventure/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /practice mode/i })).toBeInTheDocument();

  warnSpy.mockRestore();
});
