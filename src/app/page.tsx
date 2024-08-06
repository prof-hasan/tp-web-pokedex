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
				<div className='flex justify-between w-full dark:text-primary text-white'>
					<div className='flex gap-2 items-center justify-center font-bold text-3xl'>
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' height='24' viewBox='0 0 24 24' width='24'>
							<path
								d='M21.9012 13H16.8506C16.3873 15.2822 14.3696 17 11.9506 17C9.53167 17 7.51391 15.2822 7.05064 13H2C2.50172 18.0533 6.76528 22 11.9506 22C17.136 22 21.3995 18.0533 21.9012 13Z'
								className='dark:fill-primary fill-white'
							/>
							<path
								d='M21.9012 11C21.3995 5.94668 17.136 2 11.9506 2C6.76528 2 2.50172 5.94668 2 11H7.05064C7.51391 8.71776 9.53167 7 11.9506 7C14.3696 7 16.3873 8.71776 16.8506 11H21.9012Z'
								className='dark:fill-primary fill-white'
							/>
							<path
								clipRule='evenodd'
								d='M11.9506 15C13.6075 15 14.9506 13.6569 14.9506 12C14.9506 10.3431 13.6075 9 11.9506 9C10.2938 9 8.95062 10.3431 8.95062 12C8.95062 13.6569 10.2938 15 11.9506 15ZM13.4506 12C13.4506 12.8284 12.7791 13.5 11.9506 13.5C11.1222 13.5 10.4506 12.8284 10.4506 12C10.4506 11.1716 11.1222 10.5 11.9506 10.5C12.7791 10.5 13.4506 11.1716 13.4506 12Z'
								className='dark:fill-primary fill-white'
								fillRule='evenodd'
							/>
						</svg>
						Pokedéx
					</div>
					<div className='flex items-center justify-center gap-2'>
						<ThemeSwitcherButton />
						{session.data && (
							<div className='flex justify-center items-center'>
								<div className='hidden md:block'>Hello, {session.data?.user.name}</div>
								<Button variant={'ghost'} onClick={() => router.push('/api/auth/signout')}>
									Log out
								</Button>
							</div>
						)}
						{!session.data && (
							<Link href='/signin'>
								<Button variant={'ghost'}>Log in</Button>
							</Link>
						)}

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
