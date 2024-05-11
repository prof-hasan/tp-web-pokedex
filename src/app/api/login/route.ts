import * as bcrypt from 'bcrypt';

import { signJwtAccessToken } from '@/lib/jwt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { sql } from 'drizzle-orm';

interface RequestBody {
	username: string;
	password: string;
}

export async function POST(request: Request) {
	const body: RequestBody = await request.json();

	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			emailVerified: users.emailVerified,
			image: users.image,
			password: users.password,
		})
		.from(users)
		.where(sql`${users.email} = ${body.username}`);

	if (user && user.password && (await bcrypt.compare(body.password, user.password))) {
		const { password, ...userWithoutPass } = user;
		const accessToken = signJwtAccessToken(userWithoutPass);
		const result = {
			...userWithoutPass,
			accessToken,
		};

		return new Response(JSON.stringify(result));
	} else {
		return new Response(JSON.stringify(null));
	}
}
