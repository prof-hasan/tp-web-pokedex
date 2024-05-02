import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pokemons = sqliteTable('pokemon', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	base_experience: integer('base_experience'),
	height: integer('height'),
	is_default: integer('is_default'),
	order_num: integer('order_num'),
	weight: integer('weight'),
	location_area_encounters: text('location_area_encounters'),
	cries_latest: text('cries_latest'),
	cries_legacy: text('cries_legacy'),
});

export const abilities = sqliteTable('ability', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	is_hidden: integer('is_hidden'),
	slot: integer('slot'),
	ability_name: text('ability_name'),
	ability_url: text('ability_url'),
});

export const forms = sqliteTable('form', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	form_name: text('form_name'),
	form_url: text('form_url'),
});

export const gameIndexes = sqliteTable('game_index', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	game_index: integer('game_index'),
	version_name: text('version_name'),
	version_url: text('version_url'),
});

export const heldItems = sqliteTable('held_item', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	item_name: text('item_name'),
	item_url: text('item_url'),
	rarity: integer('rarity'),
	version_name: text('version_name'),
	version_url: text('version_url'),
});

export const moves = sqliteTable('move', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	move_name: text('move_name'),
	move_url: text('move_url'),
	level_learned_at: integer('level_learned_at'),
	version_group_name: text('version_group_name'),
	version_group_url: text('version_group_url'),
	move_learn_method_name: text('move_learn_method_name'),
	move_learn_method_url: text('move_learn_method_url'),
});

export const species = sqliteTable('species', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	species_name: text('species_name'),
	species_url: text('species_url'),
});

export const sprites = sqliteTable('sprite', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	back_default: text('back_default'),
	back_shiny: text('back_shiny'),
	front_default: text('front_default'),
	front_shiny: text('front_shiny'),
	dream_world_front_default: text('dream_world_front_default'),
	home_front_default: text('home_front_default'),
	home_front_shiny: text('home_front_shiny'),
	official_artwork_front_default: text('official_artwork_front_default'),
	official_artwork_front_shiny: text('official_artwork_front_shiny'),
	showdown_back_default: text('showdown_back_default'),
	showdown_back_shiny: text('showdown_back_shiny'),
	showdown_front_default: text('showdown_front_default'),
	showdown_front_shiny: text('showdown_front_shiny'),
	generation_i_red_blue_back_default: text('generation_i_red_blue_back_default'),
	generation_i_red_blue_front_default: text('generation_i_red_blue_front_default'),
	// Continue para as outras versões e formas de sprite...
});

export const stats = sqliteTable('stat', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	base_stat: integer('base_stat'),
	effort: integer('effort'),
	stat_name: text('stat_name'),
	stat_url: text('stat_url'),
});

export const types = sqliteTable('type', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	slot: integer('slot'),
	type_name: text('type_name'),
	type_url: text('type_url'),
});

export const pastTypes = sqliteTable('past_type', {
	id: integer('id').primaryKey(),
	pokemon_id: integer('pokemon_id'),
	generation_name: text('generation_name'),
	generation_url: text('generation_url'),
	type_slot: integer('type_slot'),
	past_type_name: text('past_type_name'),
	past_type_url: text('past_type_url'),
});
