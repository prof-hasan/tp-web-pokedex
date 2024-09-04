import { auth } from '@/auth';

export default async function TestPage() {
	const session = await auth();

	return <div>{JSON.stringify(session)}</div>;
}
