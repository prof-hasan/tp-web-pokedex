'use client';

import { Button } from '@/components/ui/button';
import { AArrowDown, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useQuery } from '@tanstack/react-query';
import { PokemonCard } from '@/components/PokemonCard';
import { pokemonType } from '@/db/schema/pokemons';
import Image from 'next/image';
import pokemon_placeholder from '../../public/pokemon_placeholder.png';
import { NewPokemonDialog } from '@/components/NewPokemonDialog';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThemeSwitcherButton } from '@/components/ThemeSwitcherButton';

export default function Home() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const search = searchParams.get('search');
	const sortByParam = searchParams.get('sortBy');
	const [searchString, setSearchString] = useState(search || '');
	const [sortBy, setSortBy] = useState(sortByParam || 'alphabetically');

	const session = useSession();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const pokemonList = useQuery<{ pokemonsResult: pokemonType[] }>({
		queryKey: ['pokemons'],
		queryFn: () => fetch('/api/pokemon').then((res) => res.json()),
	});

	return (
		<main className='flex min-h-screen flex-col items-center justify-between lg:p-24 p-6 bg-pokeRed'>
			<div className='flex flex-col w-full gap-3'>
				<div className='flex justify-end w-full dark:text-primary text-white'>
						<NewPokemonDialog
							trigger={
								<Button
									variant='ghost'
									size='icon'
									className='rounded-full hover:[color:var(--pokeRed)]'
								>
									<Plus />
								</Button>
							}
						/>
				</div>
				<div className='flex flex-row gap-2 items-center justify-center'>
					<Input
						className='rounded-full'
						placeholder='Search'
						startIcon={Search}
						value={searchString}
						onChange={(ev) => {
							setSearchString(ev.target.value);
							router.push(pathname + '?' + createQueryString('search', ev.target.value));
						}}
					/>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								className='rounded-full [color:var(--pokeRed)] hover:[color:var(--pokeRed)] min-w-10'
							>
								{sortBy === 'alphabetically' ? <AArrowDown /> : '#'}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='z-30'>
							<Card>
								<CardHeader>
									<CardTitle>Sort by:</CardTitle>
								</CardHeader>
								<CardContent className='flex flex-col gap-3'>
									<RadioGroup
										onValueChange={(ev) => {
											setSortBy(ev);
											router.push(pathname + '?' + createQueryString('sortBy', ev));
										}}
										defaultValue={sortBy}
									>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='alphabetically' id='name' />
											<Label htmlFor='name'>Name</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem value='number' id='number' />
											<Label htmlFor='number'>Number</Label>
										</div>
									</RadioGroup>
								</CardContent>
							</Card>
						</PopoverContent>
					</Popover>
				</div>
				<div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8'>
					{pokemonList.data &&
						pokemonList.data.pokemonsResult
							.filter((poke) => {
								if (searchString) {
									return (
										poke.givenName?.toLowerCase().includes(searchString.toLowerCase()) ||
										poke.name.toLowerCase().includes(searchString.toLowerCase())
									);
								} else {
									return true;
								}
							})
							.sort((poke1, poke2) => {
								if (sortBy === 'alphabetically') {
									if (poke1.givenName && poke2.givenName) {
										if (poke1.givenName < poke2.givenName) {
											return -1;
										}
										if (poke1.givenName > poke2.givenName) {
											return 1;
										}
										return 0;
									} else {
										if (poke1.name < poke2.name) {
											return -1;
										}
										if (poke1.name > poke2.name) {
											return 1;
										}
										return 0;
									}
								} else if (sortBy === 'number') {
									if (poke1.id < poke2.id) {
										return -1;
									}
									if (poke1.id > poke2.id) {
										return 1;
									}
									return 0;
								} else {
									return 0;
								}
							})
							.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
					<NewPokemonDialog
						trigger={
							<div className='flex cursor-pointer place-content-end flex-col bg-card rounded-2xl p-2 relative before:absolute before:content-[""] before:bg-accent before:w-full before:h-1/2 before:z-10 before:top-1/2 before:left-0 before:rounded-2xl'>
								<div className='p-3 z-10'>
									<Image
										src={pokemon_placeholder}
										alt='pokemon_placeholder'
										width={256}
										height={236}
										className='relative rounded-tl-xl rounded-tr-xl w-full h-full object-cover z-20 opacity-50'
									/>
								</div>
								<div className='text-center font-semibold mb-3 z-20 dark:text-white text-black'>
									Add pokemon
								</div>
							</div>
						}
					/>
				</div>
			</div>
		</main>
	);
}
