import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PokemonPicker } from '@/components/PokemonPicker';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = function () {};

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

// Mock `useQuery` from `@tanstack/react-query`
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

// Mock `useMediaQuery` hook
jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: jest.fn(),
}));

describe('PokemonPicker Component', () => {
  const mockOnChange = jest.fn();
  const mockPokemonData = {
    count: 2,
    next: null,
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock `useQuery` return value
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      error: null,
    });
  });

  it('renders correctly on desktop', () => {
    // Mock `useMediaQuery` to simulate desktop
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<PokemonPicker onChange={mockOnChange} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select the pokemon')).toBeInTheDocument();
  });

  it('opens and displays the list of Pokemons when button is clicked (desktop)', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<PokemonPicker onChange={mockOnChange} />);

    // Click to open the Popover
    fireEvent.click(screen.getByRole('combobox'));

    // Wait for list to appear
    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
  });

  it('selects a pokemon and calls onChange handler (desktop)', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<PokemonPicker onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('combobox'));

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Bulbasaur'));

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('renders correctly on mobile', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<PokemonPicker onChange={mockOnChange} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select the pokemon')).toBeInTheDocument();
  });

  it('opens and displays the list of Pokemons when button is clicked (mobile)', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<PokemonPicker onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('combobox'));

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
  });

  it('selects a pokemon and calls onChange handler (mobile)', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<PokemonPicker onChange={mockOnChange} />);

    fireEvent.click(screen.getByRole('combobox'));

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Bulbasaur'));

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });
});
