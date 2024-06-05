import { render, screen } from '@testing-library/react';
import Alert from './Alert';

test('Alert component', () => {
  render(<Alert title="hello" description="a description" type="info" />);
  expect(screen.getByText('a description')).toBeDefined();
});
