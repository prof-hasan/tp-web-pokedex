import { auth } from '@/auth';
import { db } from '@/db';
import { pokemons } from '@/db/schema/pokemons';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const GET = auth(async (req) => {
	if (!req.auth) {
		redirect('/api/auth/signin');
	}

	const pokemonsResult = await db.select().from(pokemons).where(eq(pokemons.userId, req.auth.user.id));

	return Response.json({ pokemonsResult }, { status: 200 });
});
