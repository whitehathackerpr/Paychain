// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace NodeJS {
    interface Global {
      jest: typeof jest;
    }
  }
}

// Mock the dfinity auth client
jest.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: jest.fn().mockResolvedValue({
      isAuthenticated: jest.fn().mockReturnValue(false),
      login: jest.fn().mockResolvedValue(true),
      logout: jest.fn().mockResolvedValue(true),
    }),
  },
}));

// Mock the dfinity principal
jest.mock('@dfinity/principal', () => ({
  Principal: {
    fromText: jest.fn().mockImplementation((text: string) => ({
      toText: () => text,
    })),
  },
})); 