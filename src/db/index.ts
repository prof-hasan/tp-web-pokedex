import * as pokemonsSchema from "./schema/pokemons";
import * as usersSchema from "./schema/users";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, {
	schema: { ...pokemonsSchema, ...usersSchema },
});
