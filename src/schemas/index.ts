import { z } from 'zod';

export const NewPokemonSchema = z.object({
	pokemonId: z.coerce.number(),
	givenName: z.string(),
	hp: z.coerce.number().positive().multipleOf(1).lte(100),
	attack: z.coerce.number().positive().multipleOf(1).lte(100),
	defense: z.coerce.number().positive().multipleOf(1).lte(100),
	'special-attack': z.coerce.number().positive().multipleOf(1).lte(100),
	'special-defense': z.coerce.number().positive().multipleOf(1).lte(100),
	speed: z.coerce.number().positive().multipleOf(1).lte(100),
	captured: z.coerce.boolean(),
});

export type NewPokemonSchemaType = z.infer<typeof NewPokemonSchema>;

export const LoginInSchema = z.object({
	email: z.string().email('This is not a valid email.').min(1, { message: 'This field has to be filled.' }),
	password: z.string(),
});

export type LoginInSchemaType = z.infer<typeof LoginInSchema>;

export const SignUpSchema = z.object({
	name: z.string(),
	email: z.string().email('This is not a valid email.').min(1, { message: 'This field has to be filled.' }),
	password: z.string(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
