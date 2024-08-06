import { auth } from '@/auth';

export const GET = auth((req) => {
	if (!req.auth) {
		return Response.json({ message: 'Not authenticated' }, { status: 401 });
	}

	return Response.json({ message: 'Authenticated' }, { status: 200 });
});
