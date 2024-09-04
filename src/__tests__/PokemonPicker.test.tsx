import React from 'react';
import { render } from '@testing-library/react';
import { PokemonPicker } from '@/components/PokemonPicker';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@/hooks/use-media-query';

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
}));

jest.mock('@/hooks/use-media-query', () => ({
	useMediaQuery: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
	capitalizeFirstLetter: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
	cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('PokemonPicker Component', () => {
	beforeEach(() => {
		(useQuery as jest.Mock).mockReturnValue({
			data: {
				count: 2,
				next: null,
				previous: null,
				results: [
					{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
					{ name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
				],
			},
			isLoading: false,
		});

		(useMediaQuery as jest.Mock).mockReturnValue(true);
	});

	it('should match the snapshot on desktop', () => {
		const { asFragment } = render(<PokemonPicker onChange={jest.fn()} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should match the snapshot on mobile', () => {
		(useMediaQuery as jest.Mock).mockReturnValue(false);
		const { asFragment } = render(<PokemonPicker onChange={jest.fn()} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
