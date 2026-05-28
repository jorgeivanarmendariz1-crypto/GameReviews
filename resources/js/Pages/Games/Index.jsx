import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Search,
    X,
    Star,
    ChevronLeft,
    ChevronRight,
    Lock,
    Unlock,
    Trash2,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

/**
 * Games/Index
 *
 * Features:
 *  1. Búsqueda debounced (350ms) por título/descripción
 *  2. Filtro por estado: todos | abiertos | cerrados
 *  3. Promedio de rating con estrella en cada card
 *  4. Paginación (preserva filtros en la URL)
 *  5. Toggle is_open (admin) — corregido, ya no usa authorize redundante
 *  6. Eliminar juego (admin) con modal de confirmación propio
 */
export default function GamesIndex({ games, filters }) {
    const { auth } = usePage().props;
    const isAdmin = Array.isArray(auth?.user?.roles)
        ? auth.user.roles.includes('admin')
        : false;

    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');

    // Modal: guarda { id, title } del juego a eliminar, o null si está cerrado
    const [confirmGame, setConfirmGame] = useState(null);

    const debounceTimer = useRef(null);

    const applyFilters = (newSearch, newStatus) => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            router.get(
                '/games',
                { search: newSearch, status: newStatus },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(val, status);
    };

    const handleStatus = (val) => {
        setStatus(val);
        clearTimeout(debounceTimer.current);
        router.get(
            '/games',
            { search, status: val },
            { preserveState: true, preserveScroll: true, replace: true },
        );
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

    const handleDeleteConfirmed = () => {
        if (!confirmGame) return;
        router.delete(`/admin/games/${confirmGame.id}`, {
            onFinish: () => setConfirmGame(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Juegos" />

            {/* Modal confirmación eliminar juego */}
            {confirmGame && (
                <ConfirmModal
                    title="Eliminar juego"
                    message={`¿Estás seguro de que quieres eliminar "${confirmGame.title}"? Esta acción no se puede deshacer y eliminará todas sus reseñas.`}
                    confirmLabel="Eliminar"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setConfirmGame(null)}
                    danger
                />
            )}

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
                                    onDelete={(game) => setConfirmGame(game)}
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

function GameCard({ game, isAdmin, onToggleOpen, onDelete }) {
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
                <div className="flex h-56 items-center justify-center bg-white/5 text-sm text-slate-500">
                    Sin portada
                </div>
            )}

            {/* CONTENT */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-bold leading-snug text-white">
                        {game.title}
                    </h2>

                    {avg ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 px-2.5 py-1 text-xs font-bold text-yellow-300">
                            <Star size={11} /> {avg}
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
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                game.is_open
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-slate-500/20 text-slate-400'
                            }`}
                        >
                            {game.is_open ? 'Abierto' : 'Cerrado'}
                        </span>

                        {isAdmin && (
                            <>
                                {/* Toggle is_open */}
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

                                {/* Eliminar juego */}
                                <button
                                    onClick={() =>
                                        onDelete({
                                            id: game.id,
                                            title: game.title,
                                        })
                                    }
                                    title="Eliminar juego"
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 transition hover:bg-red-500/20"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </>
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

/* ── ConfirmModal ────────────────────────────────────── */

/**
 * Modal de confirmación reutilizable.
 * Reemplaza al confirm() nativo del browser.
 */
function ConfirmModal({
    title,
    message,
    confirmLabel = 'Confirmar',
    onConfirm,
    onCancel,
    danger = false,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1117] p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                            danger
                                ? 'bg-red-600 hover:bg-red-500'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
