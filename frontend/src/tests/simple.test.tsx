import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Добавьте эту строку!

test('рендерит текст', () => {
  render(<div>Тестовый текст</div>);
  expect(screen.getByText('Тестовый текст')).toBeInTheDocument();
});