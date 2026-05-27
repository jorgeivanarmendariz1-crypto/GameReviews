import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import {
    Search,
    X,
    Star,
    ChevronLeft,
    ChevronRight,
    Lock,
    Unlock,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

/**
 * Games/Index
 *
 * Features añadidas:
 *  1. Búsqueda por título/descripción (debounced, se refleja en la URL)
 *  2. Filtro por estado: todos | abiertos | cerrados
 *  3. Promedio de rating con estrellas en cada card
 *  4. Paginación con links de Inertia (withQueryString preserva búsqueda)
 *  5. Toggle is_open visible solo al admin (llama a PATCH /admin/games/{id}/toggle-open)
 */
export default function GamesIndex({ games, filters }) {
    const { auth } = usePage().props;
    const isAdmin = Array.isArray(auth?.user?.roles)
        ? auth.user.roles.includes('admin')
        : false;

    // Estado local del buscador para que el input sea responsivo
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');

    // Dispara la búsqueda al backend con Inertia (preserva paginación reseteada)
    const applyFilters = useCallback((newSearch, newStatus) => {
        router.get(
            '/games',
            { search: newSearch, status: newStatus },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(val, status);
    };

    const handleStatus = (val) => {
        setStatus(val);
        applyFilters(search, val);
    };

    const clearSearch = () => {
        setSearch('');
        applyFilters('', status);
    };

    const handleToggleOpen = (gameId) => {
        router.patch(
            `/admin/games/${gameId}/toggle-open`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Juegos" />

            <div className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-7xl">
                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-extrabold tracking-tight">
                            Biblioteca de Juegos
                        </h1>
                        <p className="mt-3 text-slate-300">
                            Explora juegos, mira reseñas y comparte tu opinión.
                        </p>
                    </div>

                    {/* FILTROS */}
                    <div className="mb-8 flex flex-wrap gap-3">
                        {/* Buscador */}
                        <div className="relative min-w-[200px] flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Buscar juego..."
                                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Filtro estado */}
                        <div className="flex gap-2">
                            {[
                                { val: '', label: 'Todos' },
                                { val: 'open', label: 'Abiertos' },
                                { val: 'closed', label: 'Cerrados' },
                            ].map(({ val, label }) => (
                                <button
                                    key={val}
                                    onClick={() => handleStatus(val)}
                                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                        status === val
                                            ? 'bg-indigo-600 text-white'
                                            : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RESULTADOS */}
                    {games.data.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
                            {search
                                ? `Sin resultados para "${search}".`
                                : 'No hay juegos publicados todavía.'}
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {games.data.map((g) => (
                                <GameCard
                                    key={g.id}
                                    game={g}
                                    isAdmin={isAdmin}
                                    onToggleOpen={handleToggleOpen}
                                />
                            ))}
                        </div>
                    )}

                    {/* PAGINACIÓN */}
                    {games.last_page > 1 && <Pagination meta={games} />}
                </div>
            </div>
        </AppLayout>
    );
}

/* ── GameCard ────────────────────────────────────────── */

function GameCard({ game, isAdmin, onToggleOpen }) {
    const avg = game.reviews_avg_rating
        ? parseFloat(game.reviews_avg_rating).toFixed(1)
        : null;
    const count = game.reviews_count ?? 0;

    return (
        <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(99,102,241,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
            {/* COVER */}
            {game.cover_path ? (
                <img
                    src={`/storage/${game.cover_path}`}
                    alt={game.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-56 items-center justify-center bg-white/5 text-slate-500">
                    Sin portada
                </div>
            )}

            {/* CONTENT */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-bold leading-snug text-white">
                        {game.title}
                    </h2>

                    {/* Rating badge */}
                    {avg ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 px-2.5 py-1 text-xs font-bold text-yellow-300">
                            <Star size={11} />
                            {avg}
                            <span className="font-normal opacity-60">/ 10</span>
                        </span>
                    ) : (
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-500">
                            Sin reseñas
                        </span>
                    )}
                </div>

                {count > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                        {count} {count === 1 ? 'reseña' : 'reseñas'}
                    </p>
                )}

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                    {game.description}
                </p>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {/* Badge estado */}
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                game.is_open
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-slate-500/20 text-slate-400'
                            }`}
                        >
                            {game.is_open ? 'Abierto' : 'Cerrado'}
                        </span>

                        {/* Toggle is_open — solo admin */}
                        {isAdmin && (
                            <button
                                onClick={() => onToggleOpen(game.id)}
                                title={
                                    game.is_open
                                        ? 'Cerrar reseñas'
                                        : 'Abrir reseñas'
                                }
                                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            >
                                {game.is_open ? (
                                    <Lock size={13} />
                                ) : (
                                    <Unlock size={13} />
                                )}
                            </button>
                        )}
                    </div>

                    <Link
                        href={`/games/${game.id}`}
                        className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                    >
                        Ver detalle →
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ── Paginación ──────────────────────────────────────── */

function Pagination({ meta }) {
    const goTo = (url) => {
        if (url)
            router.visit(url, { preserveState: true, preserveScroll: false });
    };

    return (
        <div className="mt-10 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
                Mostrando{' '}
                <span className="text-white">
                    {meta.from}–{meta.to}
                </span>{' '}
                de <span className="text-white">{meta.total}</span> juegos
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => goTo(meta.prev_page_url)}
                    disabled={!meta.prev_page_url}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                    <ChevronLeft size={15} /> Anterior
                </button>

                <span className="text-sm text-slate-400">
                    {meta.current_page} / {meta.last_page}
                </span>

                <button
                    onClick={() => goTo(meta.next_page_url)}
                    disabled={!meta.next_page_url}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-30"
                >
                    Siguiente <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
}
