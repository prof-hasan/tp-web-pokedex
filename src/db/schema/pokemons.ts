import { createId } from '@paralleldrive/cuid2';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const pokemons = sqliteTable('pokemon', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	pokemonId: integer('pokemonId').notNull(),
	givenName: text('givenName'),
	name: text('name').notNull(),
	image: text('image').notNull(),
	species: text('species'),
	stats: text('stats'),
	moves: text('moves'),
	types: text('types'),
	abilities: text('abilities'),
	height: integer('height'),
	weight: integer('weight'),
	captured: integer('captured', { mode: 'boolean' }),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
});

export type pokemonType = typeof pokemons.$inferSelect;
