'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { pokemons } from '@/db/schema/pokemons';
import { summarizePokemon } from '@/lib/utils';
import { NewPokemonSchemaType, NewPokemonSchema } from '@/schemas';
import { redirect } from 'next/navigation';

export async function CreatePokemon(form: NewPokemonSchemaType) {
	const parsedBody = NewPokemonSchema.safeParse(form);
	if (!parsedBody.success) {
		throw new Error(parsedBody.error.message);
	}

	const session = await auth();
	if (!session?.user) {
		redirect('/api/auth/signin');
	}

	const { givenName, pokemonId, captured } = parsedBody.data;

	const fetchedPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then((res) => res.json());
	const currentPokemon = summarizePokemon(fetchedPokemon);

	await db.insert(pokemons).values({
		givenName,
		pokemonId,
		captured,
		userId: session.user.id,
		stats: `hp: ${parsedBody.data.hp}, attack: ${parsedBody.data.attack}, defense: ${parsedBody.data.defense}, special-attack: ${parsedBody.data['special-attack']}, special-defense: ${parsedBody.data['special-defense']}, speed: ${parsedBody.data.speed}`,
		name: currentPokemon.name,
		image: currentPokemon.image,
		species: currentPokemon.species,
		types: currentPokemon.types,
		moves: currentPokemon.moves,
		abilities: currentPokemon.abilities,
		weight: currentPokemon.weight,
		height: currentPokemon.height,
	});
}
