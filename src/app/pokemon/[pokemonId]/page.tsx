import { PokemonInfo } from '@/components/PokemonInfo';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function PokemonDetailPage({ params: { pokemonId } }: { params: { pokemonId: string } }) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: [`pokemon${pokemonId}`],
		queryFn: () => fetch(`/api/getPokemon?id=${pokemonId}`).then((res) => res.json()),
	});

	return (
		<main className='h-full w-full'>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<PokemonInfo id={pokemonId} />
			</HydrationBoundary>
		</main>
	);
}
