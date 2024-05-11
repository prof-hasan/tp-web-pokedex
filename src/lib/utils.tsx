import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function typeToCssVar(type: string) {
	return `var(--${type})`;
}

export const getSvgIcon = (
	<svg xmlns='http://www.w3.org/2000/svg' fill='none' height='24' viewBox='0 0 24 24' width='24'>
		<path
			d='M21.9012 13H16.8506C16.3873 15.2822 14.3696 17 11.9506 17C9.53167 17 7.51391 15.2822 7.05064 13H2C2.50172 18.0533 6.76528 22 11.9506 22C17.136 22 21.3995 18.0533 21.9012 13Z'
			fill='white'
		/>
		<path
			d='M21.9012 11C21.3995 5.94668 17.136 2 11.9506 2C6.76528 2 2.50172 5.94668 2 11H7.05064C7.51391 8.71776 9.53167 7 11.9506 7C14.3696 7 16.3873 8.71776 16.8506 11H21.9012Z'
			fill='white'
		/>
		<path
			clipRule='evenodd'
			d='M11.9506 15C13.6075 15 14.9506 13.6569 14.9506 12C14.9506 10.3431 13.6075 9 11.9506 9C10.2938 9 8.95062 10.3431 8.95062 12C8.95062 13.6569 10.2938 15 11.9506 15ZM13.4506 12C13.4506 12.8284 12.7791 13.5 11.9506 13.5C11.1222 13.5 10.4506 12.8284 10.4506 12C10.4506 11.1716 11.1222 10.5 11.9506 10.5C12.7791 10.5 13.4506 11.1716 13.4506 12Z'
			fill='white'
			fillRule='evenodd'
		/>
	</svg>
);

function upperCaseFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function summarizePokemon(pokemon: any) {
	return {
		name: upperCaseFirstLetter(pokemon.name),
		id: pokemon.id,
		image: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
		species: pokemon.species.name,
		types: (pokemon.types || [])
			.slice(0, 10)
			.map((s: any) => s.type.name)
			.join(', '),
		stats: (pokemon.stats || [])
			.slice(0, 10)
			.map((s: any) => `${s.stat.name}: ${s.base_stat}`)
			.join(', '),
		moves: (pokemon.moves || [])
			.slice(0, 10)
			.map((m: any) => m.move.name)
			.join(', '),
		abilities: (pokemon.abilities || [])
			.slice(0, 10)
			.map((m: any) => m.ability.name)
			.join(', '),
		weight: pokemon.weight,
		height: pokemon.height,
	};
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatId(id: string | number) {
	return '#' + id.toString().padStart(3, '0');
}