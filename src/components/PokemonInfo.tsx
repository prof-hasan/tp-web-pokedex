'use client';
import { capitalizeFirstLetter, formatId, typeToCssVar } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, Weight } from 'lucide-react';
import Image from 'next/image';
import { Progress } from './ui/progress';
import pokedex from '../../public/pokedex.svg';
import pokemon_placeholder from '../../public/pokemon_placeholder.png';
import Link from 'next/link';
import { ThemeSwitcherButton } from './ThemeSwitcherButton';

export function PokemonInfo({ id, pokemon: initialPokemon }: { id: string; pokemon?: any }) {
	const pokemonQuery = useQuery({
		queryKey: [`pokemon${id}`],
		queryFn: () => fetch(`/api/getPokemon?id=${id}`).then((res) => res.json()),
	});

	const pokemon = initialPokemon || pokemonQuery.data;

	const types = pokemon && pokemon.types && pokemon.types.split(',').map((type: string) => type.trim());
	const mainType = types && types[0];
	const stats =
		pokemon &&
		pokemon.stats &&
		pokemon.stats.split(',').map((stat: string) => {
			const splittedStat = stat.split(':');
			return {
				name: splittedStat[0],
				number: Number(splittedStat[1]),
			};
		});

	return pokemon ? (
		<div
			className='flex flex-col items-center justify-center gap-4'
			style={{
				backgroundColor: typeToCssVar(mainType),
			}}
		>
			<div className='flex flex-row gap-2 items-center justify-center text-white mt-10'>
				<Link href={'/'}>
					<ArrowLeft color='white' />
				</Link>
				<div className='text-xl font-bold'>{pokemon.givenName || pokemon.name}</div>
				<div>{formatId(pokemon.id)}</div>
			</div>
			<div className='relative flex items-center justify-center'>
				{!pokemon.givenName && pokemon.id > 1 && (
					<Link className='z-30' href={`/pokemon/${pokemon.id - 1}`}>
						<ChevronLeft color='white' />
					</Link>
				)}
				<Image className='relative z-20' src={pokemon.image} width={200} height={200} alt={pokemon.name} />
				{!pokemon.givenName && pokemon.id < 1025 && (
					<Link className='z-30' href={`/pokemon/${pokemon.id + 1}`}>
						<ChevronRight color='white' />
					</Link>
				)}
				<Image className='absolute top-0 left-10 opacity-10 z-10' alt='' src={pokedex} />
			</div>
			<div className='rounded-lg bg-background shadow-md p-8 flex flex-col gap-6 min-w-40'>
				<div className='flex flex-row gap-4 items-center justify-center'>
					{types.map((type: string) => (
						<div
							className='text-md text-white rounded-3xl p-2'
							key={type}
							style={{
								backgroundColor: typeToCssVar(type),
							}}
						>
							{capitalizeFirstLetter(type)}
						</div>
					))}
				</div>
				<div className='text-lg font-semibold text-center'>About</div>
				<div className='grid grid-cols-3 divide-x-2'>
					<div className='flex flex-col gap-4'>
						<div className='flex justify-center items-center gap-2'>
							<Weight size={12} />
							{pokemon.weight / 10} kg
						</div>
						<div className='text-xs text-center'>Weight</div>
					</div>
					<div className='flex flex-col gap-4'>
						<div className='flex justify-center items-center gap-2'>
							<Ruler size={12} />
							{pokemon.height / 10} m
						</div>
						<div className='text-xs text-center'>Weight</div>
					</div>
					<div className='flex flex-col gap-4 justify-center items-center'>
						{pokemon.abilities.split(', ').map((ability: string) => (
							<div className='text-md rounded-3xl p-2' key={ability}>
								{ability.charAt(0).toUpperCase() + ability.slice(1)}
							</div>
						))}
						<div className='text-xs text-center'>Abilities</div>
					</div>
				</div>
				<div className='text-lg font-semibold text-center'>Base stats</div>
				<div className='flex flex-col gap-3 justify-center'>
					{stats.map((stat: any) => (
						<div className='flex items-center justify-center gap-2' key={stat.name}>
							<div className='text- font-bold min-w-10' style={{ color: typeToCssVar(mainType) }}>
								{getStatAbbrev(stat.name) || stat.name}
							</div>{' '}
							{stat.number}{' '}
							<Progress className='h-2' indicatorColor={typeToCssVar(mainType)} value={stat.number} />
						</div>
					))}
				</div>
			</div>
		</div>
	) : (
		<div className='flex flex-col items-center justify-center gap-4 bg-gray-700'>
			<div className='flex flex-row gap-2 items-center justify-center text-white mt-10'>
				<div className='text-xl font-bold'>404 - Pokémon não encontrado</div>
			</div>
			<div className='relative flex items-center justify-center'>
				<Image
					className='relative z-20'
					src={pokemon_placeholder}
					width={200}
					height={200}
					alt='pokemon_placeholder'
				/>
				<Image className='absolute top-0 left-10 opacity-10 z-10' alt='' src={pokedex} />
			</div>
			<div className='rounded-lg bg-white shadow-md p-8 flex flex-col gap-6 min-w-40'>
				<div className='flex flex-row gap-4 items-center justify-center'>
					<div className='text-md text-white rounded-3xl p-2 bg-gray-700'>Não existente</div>
					<div className='text-md text-white rounded-3xl p-2 bg-gray-700'>Não existente 4.0.4</div>
				</div>
				<div className='text-lg font-semibold text-center'>About</div>
				<div className='grid grid-cols-3 divide-x-2 gap-4'>
					<div className='flex flex-col gap-4'>
						<div className='flex justify-center items-center gap-2'>
							<Weight size={12} />
							404 kg
						</div>
						<div className='text-xs text-center'>Weight</div>
					</div>
					<div className='flex flex-col gap-4'>
						<div className='flex justify-center items-center gap-2'>
							<Ruler size={12} />
							404 m
						</div>
						<div className='text-xs text-center'>Weight</div>
					</div>
					<div className='flex flex-col gap-4 justify-center items-center text-center'>
						<span>Muitas habilidades, </span>
						<span>se existisse...</span>
						<div className='text-xs text-center'>Abilities</div>
					</div>
				</div>
				<div className='text-lg font-semibold text-center'>Base stats</div>
				<div className='flex flex-col gap-3 justify-center'>
					<div className='flex items-center justify-center gap-2'>
						<div className='text-sm min-w-10 text-gray-700'>Status que não existe</div>
						<Progress className='h-2' indicatorColor='gray' value={Math.floor(Math.random() * 100)} />
					</div>
					<div className='flex items-center justify-center gap-2'>
						<div className='text-sm min-w-10 text-gray-700'>Outro que não existe</div>
						<Progress className='h-2' indicatorColor='gray' value={Math.floor(Math.random() * 100)} />
					</div>
					<div className='flex items-center justify-center gap-2'>
						<div className='text-sm min-w-10 text-gray-700'>Mais um que não existe</div>
						<Progress className='h-2' indicatorColor='gray' value={Math.floor(Math.random() * 100)} />
					</div>
				</div>
			</div>
		</div>
	);
}

function getStatAbbrev(stat: string): string {
	const STAT_MAP = {
		hp: 'HP',
		attack: 'ATK',
		defense: 'DEF',
		'special-attack': 'SATK',
		'special-defense': 'SDEF',
		speed: 'SPD',
	};

	return STAT_MAP[stat.trim() as keyof typeof STAT_MAP] || '';
}
