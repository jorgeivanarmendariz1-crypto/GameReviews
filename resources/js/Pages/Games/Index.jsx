import { Head, Link } from '@inertiajs/react';

export default function GamesIndex({ games }) {
    return (
        <>
            <Head title="Juegos" />

            <div className="min-h-screen px-6 py-10">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white">
                                Juegos
                            </h1>
                            <p className="mt-2 text-slate-300">
                                Selecciona un juego para ver reseñas o publicar
                                la tuya.
                            </p>
                        </div>

                        <Link
                            href="/dashboard"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200 hover:bg-white/10"
                        >
                            ← Dashboard
                        </Link>
                    </div>

                    {games.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-200">
                            No hay juegos disponibles aún.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {games.map((g) => (
                                <div
                                    key={g.id}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(99,102,241,0.12)] backdrop-blur-xl"
                                >
                                    <h2 className="text-xl font-bold text-white">
                                        {g.title}
                                    </h2>
                                    <p className="mt-2 line-clamp-3 text-sm text-slate-300">
                                        {g.description}
                                    </p>

                                    {/* Más adelante aquí pondremos: "Ver detalles" / "Escribir reseña" */}
                                    <div className="mt-5 text-sm text-slate-400">
                                        ID: {g.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
