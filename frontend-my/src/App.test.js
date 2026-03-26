import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch API
global.fetch = jest.fn();

// Mock the reviewService
jest.mock('./services/reviewService', () => ({
  login: jest.fn(),
  getReviews: jest.fn(),
  searchReviews: jest.fn(),
  createReview: jest.fn(),
  upvote: jest.fn(),
  downvote: jest.fn(),
  getUserProfile: jest.fn(),
  getUserStats: jest.fn(),
  getMyReviews: jest.fn(),
  getUserReviewsByUpvotes: jest.fn(),
  getUserReviewsByDownvotes: jest.fn(),
  getUserReviewsRecent: jest.fn()
}));

describe('ReviewSaver App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock successful login response
    fetch.mockImplementation((url) => {
      if (url.includes('/api/login')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ userId: 1, message: 'Login successful' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ content: [] })
      });
    });
  });

  test('renders login page initially', () => {
    render(<App />);
    
    // Check if login form is rendered
    expect(screen.getByText(/Login to ReviewSaver/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('displays error on invalid login', async () => {
    // Mock failed login
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      })
    );
    
    render(<App />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'invalid@email.com');
    await userEvent.click(loginButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Connection error/i)).toBeInTheDocument();
    });
  });

  test('successful login shows dashboard', async () => {
    render(<App />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Wait for dashboard to appear
    await waitFor(() => {
      expect(screen.getByText(/Total Reviews/i)).toBeInTheDocument();
    });
  });

  test('search input appears after login', async () => {
    render(<App />);
    
    // Login
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Check for search input
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search reviews/i)).toBeInTheDocument();
    });
  });

  test('review form appears after login', async () => {
    render(<App />);
    
    // Login
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Check for review form
    await waitFor(() => {
      expect(screen.getByText(/Write a Review/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\., Avengers: Endgame/i)).toBeInTheDocument();
    });
  });

  test('logout button appears after login', async () => {
    render(<App />);
    
    // Login
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Check for logout button
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
  });

  test('clicking logout returns to login page', async () => {
    render(<App />);
    
    // Login
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Wait for logout button
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
    
    // Click logout
    const logoutButton = screen.getByText(/Logout/i);
    await userEvent.click(logoutButton);
    
    // Check if login page reappears
    expect(screen.getByText(/Login to ReviewSaver/i)).toBeInTheDocument();
  });

  test('category filter exists after login', async () => {
    render(<App />);
    
    // Login
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(loginButton);
    
    // Check for category filter
    await waitFor(() => {
      expect(screen.getByText(/All Categories/i)).toBeInTheDocument();
      expect(screen.getByText(/Movies/i)).toBeInTheDocument();
      expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    });
  });
});
