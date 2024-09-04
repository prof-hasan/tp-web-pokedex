'use client';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

type pokemonFetchResponseType = { name: string; url: string };

export function PokemonPicker({ onChange }: { onChange: (value: string) => void }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

	useEffect(() => {
		if (!value) return;
		onChange(value);
	}, [onChange, value]);

	const pokemonListQuery = useQuery<{
		count: number;
		next: string | null;
		previous: string | null;
		results: pokemonFetchResponseType[];
	}>({
		queryKey: ['pokemonsPokeApi'],
		queryFn: () => fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10000').then((res) => res.json()),
	});

	const selectedPokemon = pokemonListQuery.data?.results.find(
		(pokemon: pokemonFetchResponseType) => pokemon.url.split('/').at(-2) === value
	);

	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						role='combobox'
						aria-expanded={open}
						className='w-[200px] justify-between ml-3'
					>
						{selectedPokemon ? `${capitalizeFirstLetter(selectedPokemon.name)}` : 'Select the pokemon'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[200px] p-0'>
					<PokemonList
						setOpen={setOpen}
						setValue={setValue}
						pokemonListQuery={pokemonListQuery}
						value={value}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant={'outline'}
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between ml-3'
				>
					{selectedPokemon ? `${capitalizeFirstLetter(selectedPokemon.name)}` : 'Select the pokemon'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='mt-4 border-t'>
					<PokemonList
						setOpen={setOpen}
						setValue={setValue}
						pokemonListQuery={pokemonListQuery}
						value={value}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function PokemonList({
	pokemonListQuery,
	setValue,
	setOpen,
	value,
}: {
	pokemonListQuery: UseQueryResult<
		{
			count: number;
			next: string | null;
			previous: string | null;
			results: pokemonFetchResponseType[];
		},
		Error
	>;
	setValue: Dispatch<SetStateAction<string>>;
	setOpen: Dispatch<SetStateAction<boolean>>;
	value: string;
}) {
	return (
		<Command
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<CommandInput placeholder='Search pokemon...' />
			<CommandEmpty>
				<p>Pokemon not found</p>
			</CommandEmpty>
			<CommandGroup>
				<CommandList>
					{pokemonListQuery.data &&
						pokemonListQuery.data?.results.map((pokemon: pokemonFetchResponseType, index) => (
							<CommandItem
								key={pokemon.name}
								onSelect={() => {
									setValue(String(pokemon.url.split('/').at(-2)!));
									setOpen((prev) => !prev);
								}}
							>
								{capitalizeFirstLetter(pokemon.name)}
								<Check
									className={cn(
										'mr-2 w-4 h-4 opacity-0',
										value === pokemon.url.split('/').at(-2) && 'opacity-100'
									)}
								/>
							</CommandItem>
						))}
				</CommandList>
			</CommandGroup>
		</Command>
	);
}
