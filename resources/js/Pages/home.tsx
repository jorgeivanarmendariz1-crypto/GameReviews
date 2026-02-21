export default function Home() {
    const games = [
        { id: 1, title: 'Elden Ring', rating: 9.5 },
        { id: 2, title: 'God of War', rating: 9.0 },
        { id: 3, title: 'Cyberpunk 2077', rating: 8.2 },
    ];

    return (
        <div className="min-h-screen bg-background p-10 text-foreground">
            <h1 className="mb-8 text-4xl font-bold text-indigo-500">
                🎮 Catálogo de Juegos
            </h1>

            <div className="grid gap-6 md:grid-cols-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:scale-105"
                    >
                        <h2 className="mb-2 text-xl font-semibold">
                            {game.title}
                        </h2>
                        <p className="font-bold text-indigo-400">
                            ⭐ {game.rating}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
