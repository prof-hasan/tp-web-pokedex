import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/db';
import { pokemons } from '@/db/schema/pokemons';
import { users } from '@/db/schema/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { sql, eq, count } from 'drizzle-orm';

export default async function Social({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const usersCount = await db
        .select({
            id: users.id,
            name: users.name,
            image: users.image,
            viewedPokemonCount: count(pokemons.id),
            capturedPokemonCount: count(sql`CASE WHEN ${pokemons.captured} = true THEN 1 END`),
        })
        .from(users)
        .leftJoin(pokemons, eq(pokemons.userId, users.id))
        .groupBy(users.id, users.name);

    return (
        <div className="lg:px-24 lg:py-6 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 w-full">
            {usersCount.map((user) => (
                <Card key={user.id} className="w-full max-w-lg">
                    <CardContent className="p-6 flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <div className="font-medium text-ellipsis overflow-hidden">{user.name}</div>
                            <div className="text-muted-foreground">
                                <span className="font-medium">Viewed pokemons</span> {user.viewedPokemonCount}
                            </div>
                            <div className="text-muted-foreground">
                                <span className="font-medium">Captured pokemons</span> {user.capturedPokemonCount}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
