import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertion methods
import { PokemonCard } from '@/components/PokemonCard'; // Adjust the path if necessary
import { pokemonType } from '@/db/schema/pokemons';

// Mock dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

jest.mock('@/lib/utils', () => ({
  formatId: jest.fn((id: number) => `#${String(id).padStart(3, '0')}`),
}));

describe('PokemonCard', () => {
  const mockPokemon: pokemonType = {
    id: '1',
    pokemonId: 25,
    name: 'Pikachu',
    givenName: 'Sparky',
    image: '/pikachu.png',
    captured: true,
    species: 'Mouse Pokémon',
    stats: null,
    moves: null,
    types: null,
    abilities: null,
    height: null,
    weight: null,
    userId: 'user123',
  };

  it('renders correctly with all props', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    // Check for the formatted ID
    expect(screen.getByText('#025')).toBeInTheDocument();

    // Check for the captured label
    expect(screen.getByText('Captured')).toBeInTheDocument();

    // Check for the image with correct alt text
    const imgElement = screen.getByAltText('Pikachu');
    expect(imgElement).toHaveAttribute('src', mockPokemon.image);
    expect(imgElement).toHaveAttribute('width', '300');
    expect(imgElement).toHaveAttribute('height', '300');

    // Check for the given name
    expect(screen.getByText('Sparky')).toBeInTheDocument();

    // Check that the link points to the correct href
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', `pokemon/${mockPokemon.id}`);
  });

  it('renders correctly when the pokemon is not captured and has no given name', () => {
    const mockPokemonWithoutCapture: pokemonType = {
      ...mockPokemon,
      captured: false,
      givenName: null,
    };

    render(<PokemonCard pokemon={mockPokemonWithoutCapture} />);

    // Check that "Captured" label is not in the document
    expect(screen.queryByText('Captured')).not.toBeInTheDocument();

    // Check for the default name
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  
});
