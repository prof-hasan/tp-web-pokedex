import { auth } from '@/auth';
import { db } from '@/db';
import { pokemons } from '@/db/schema/pokemons';
import { summarizePokemon } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

export const GET = auth(async (req) => {
	const { searchParams } = new URL(req.url);
	const idParam = searchParams.get('id');

	if (!idParam) {
		return Response.json(null, { status: 404 });
	}

	if (req.auth) {
		const dbResult = await db
			.select()
			.from(pokemons)
			.where(and(eq(pokemons.userId, req.auth.user.id), eq(pokemons.id, idParam)));

		if (dbResult && dbResult.length) {
			return Response.json(dbResult[0], { status: 200 });
		}
	}

	const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${idParam}`);
	if (resp.status % 4 !== 100) {
		return Response.json(summarizePokemon(await resp.json()), { status: 200 });
	}

	return Response.json(null, { status: 404 });
});
