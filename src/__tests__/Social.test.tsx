import React from 'react';
import { render, screen } from '@testing-library/react';
import Social from '@/app/social/page';

// Dados simulados retornados pelo banco de dados
const mockUsers = [
	{
		id: '1',
		name: 'Ash Ketchum',
		image: 'ash.jpg',
		viewedPokemonCount: 151,
		capturedPokemonCount: 100,
	},
	{
		id: '2',
		name: 'Misty',
		image: null,
		viewedPokemonCount: 102,
		capturedPokemonCount: 80,
	},
];

// Mock da função de seleção do banco de dados
jest.mock('@/db', () => ({
	db: {
		select: jest.fn(() => ({
			from: jest.fn(() => ({
				leftJoin: jest.fn(() => ({
					groupBy: jest.fn(() => mockUsers),
				})),
			})),
		})),
	},
}));
jest.mock('@/db/schema/pokemons', () => ({
	pokemons: {
		id: 'id',
		captured: 'captured',
		userId: 'userId',
	},
}));
jest.mock('@/db/schema/users', () => ({
	users: {
		id: 'id',
		name: 'name',
		image: 'image',
	},
}));

jest.mock('drizzle-orm', () => ({
	sql: jest.fn(),
	eq: jest.fn(),
	count: jest.fn(),
}));

describe('Social Component', () => {
	beforeEach(() => {
		// Reseta os mocks antes de cada teste
		jest.clearAllMocks();
	});

	it('should render user cards correctly', async () => {
		// Mock the API response
		jest.mock('@/db', () => ({
			db: {
				select: jest.fn(() => ({
					from: jest.fn(() => ({
						leftJoin: jest.fn(() => ({
							groupBy: jest.fn(() => Promise.resolve(mockUsers)), // Resolve the promise
						})),
					})),
				})),
			},
		}));

		// Render the component
		render(await Social({}));

		// Verify if the data is rendered correctly
		expect(await screen.findByText('Ash Ketchum')).toBeInTheDocument();
		expect(screen.getByText('151')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument();

		expect(await screen.findByText('Misty')).toBeInTheDocument();
		expect(screen.getByText('102')).toBeInTheDocument();
		expect(screen.getByText('80')).toBeInTheDocument();
	});
});
