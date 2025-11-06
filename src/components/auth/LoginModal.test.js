import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from './LoginModal';

describe('LoginModal Component', () => {
  const mockOnClose = jest.fn();
  const mockChildren = <div data-testid="modal-content">Modal Content</div>;

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <LoginModal isOpen={true} onClose={mockOnClose}>
        {mockChildren}
      </LoginModal>
    );

    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument(); // Close button
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <LoginModal isOpen={false} onClose={mockOnClose}>
        {mockChildren}
      </LoginModal>
    );

    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <LoginModal isOpen={true} onClose={mockOnClose}>
        {mockChildren}
      </LoginModal>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    render(
      <LoginModal isOpen={true} onClose={mockOnClose}>
        {mockChildren}
      </LoginModal>
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when modal container is clicked', () => {
    render(
      <LoginModal isOpen={true} onClose={mockOnClose}>
        {mockChildren}
      </LoginModal>
    );

    const modalContainer = screen.getByTestId('modal-container');
    fireEvent.click(modalContainer);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('renders children correctly', () => {
    render(
      <LoginModal isOpen={true} onClose={mockOnClose}>
        <div data-testid="custom-content">Custom Content</div>
      </LoginModal>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});