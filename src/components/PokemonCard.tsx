import { pokemonType } from '@/db/schema/pokemons';
import { formatId } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function PokemonCard({ pokemon }: { pokemon: pokemonType }) {
	return (
		<Link
			href={`pokemon/${pokemon.id}`}
			className='items-center justify-center flex flex-col bg-card rounded-2xl p-2 relative before:absolute before:content-[""] before:bg-accent before:w-full before:h-1/2 before:z-10 before:[top:50%] before:[left:0] before:rounded-2xl'
		>
			<div className='self-end mr-4 flex gap-2'>
				{pokemon.captured && <div className='self-start'>Captured</div>}
				{pokemon.pokemonId ? formatId(pokemon.pokemonId) : formatId(pokemon.id)}
			</div>
			<Image
				src={pokemon.image}
				alt={pokemon.name}
				width={300}
				height={300}
				className='rounded-tl-xl rounded-tr-xl w-full h-full object-cover z-20'
			/>
			<div className='text-center font-semibold mb-3 z-20 dark:text-white text-black'>
				{pokemon.givenName || pokemon.name}
			</div>
		</Link>
	);
}
