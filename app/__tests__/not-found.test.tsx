import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound', () => {
  it('renders the not found page with correct content', () => {
    render(<NotFound />);

    // Check if the main heading is rendered
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();

    // Check if the description is rendered
    expect(
      screen.getByText("Oops! Looks like this design hasn't been printed yet.")
    ).toBeInTheDocument();

    // Check if the return home link is rendered
    const returnHomeLink = screen.getByRole('link', { name: /return to home/i });
    expect(returnHomeLink).toBeInTheDocument();
    expect(returnHomeLink).toHaveAttribute('href', '/');

    // Check if the emoji is rendered
    expect(screen.getByText('👕')).toBeInTheDocument();
  });
});
