import { auth } from "@/auth";
import { db } from "@/db";
import Link from "next/link";

export default async function Home() {
	const session = await auth();
	const products = await db.query.pokemon.findMany();
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{JSON.stringify(session)}
			{JSON.stringify(products)}
			<Link href={"/api/auth/signin"}>Logar</Link>
			<Link href={"/api/auth/signout"}>Deslogar</Link>
		</main>
	);
}
