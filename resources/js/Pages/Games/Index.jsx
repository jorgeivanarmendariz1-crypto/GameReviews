import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function GamesIndex({ games }) {
    return (
        <AppLayout>
            <Head title="Juegos" />

            <div className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-7xl">
                    {/* HEADER */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-extrabold tracking-tight">
                            Biblioteca de Juegos
                        </h1>
                        <p className="mt-3 text-slate-300">
                            Explora juegos, mira reseñas y comparte tu opinión.
                        </p>
                    </div>

                    {/* EMPTY */}
                    {games.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
                            No hay juegos publicados todavía.
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {games.map((g) => (
                                <div
                                    key={g.id}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(99,102,241,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
                                >
                                    {/* COVER */}
                                    {g.cover_path ? (
                                        <img
                                            src={`/storage/${g.cover_path}`}
                                            alt={g.title}
                                            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-60 items-center justify-center bg-white/5 text-slate-500">
                                            Sin portada
                                        </div>
                                    )}

                                    {/* CONTENT */}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold text-white">
                                            {g.title}
                                        </h2>

                                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                                            {g.description}
                                        </p>

                                        {/* FOOTER */}
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                                                {g.is_open
                                                    ? 'Reseñas abiertas'
                                                    : 'Reseñas cerradas'}
                                            </span>

                                            <Link
                                                href={`/games/${g.id}`}
                                                className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                                            >
                                                Ver detalle →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
