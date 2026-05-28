import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Gamepad2, ClipboardList, Star, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

/**
 * User/Dashboard
 *
 * Ahora recibe `reviews` desde el DashboardController con la relación
 * `game` cargada para mostrar el nombre del juego en cada reseña.
 *
 * El usuario puede editar (navega a games/{id}) o eliminar sus reseñas
 * directamente desde aquí sin salir del dashboard.
 */
export default function Dashboard({ reviews = [] }) {
    const { auth } = usePage().props;
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = (id) => {
        setDeletingId(id);
        router.delete(`/reviews/${id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setConfirmId(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Mi panel" />

            {confirmId && (
                <ConfirmModal
                    title="Eliminar reseña"
                    message="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    onConfirm={() => handleDelete(confirmId)}
                    onCancel={() => setConfirmId(null)}
                    danger
                />
            )}

            <div className="mx-auto max-w-5xl px-6 py-10">
                {/* Bienvenida */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white">
                        Hola,{' '}
                        <span className="text-indigo-400">
                            {auth?.user?.name || auth?.user?.email}
                        </span>
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Aquí puedes ver y gestionar tus reseñas.
                    </p>
                </div>

                {/* Stats rápidas */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Reseñas publicadas"
                        value={reviews.length}
                        color="indigo"
                    />
                    <StatCard
                        label="Juegos reseñados"
                        value={new Set(reviews.map((r) => r.game_id)).size}
                        color="purple"
                    />
                    <StatCard
                        label="Promedio de rating"
                        value={
                            reviews.length
                                ? (
                                      reviews.reduce(
                                          (s, r) => s + r.rating,
                                          0,
                                      ) / reviews.length
                                  ).toFixed(1)
                                : '—'
                        }
                        color="yellow"
                    />
                </div>

                {/* Acciones rápidas */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <Link
                        href="/games"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    >
                        <Gamepad2 size={16} /> Explorar juegos
                    </Link>
                    <Link
                        href="/petitions/create"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                    >
                        <ClipboardList size={16} /> Pedir un juego
                    </Link>
                </div>

                {/* Lista de reseñas */}
                <div>
                    <h2 className="mb-4 text-xl font-bold text-white">
                        Mis reseñas
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({reviews.length})
                        </span>
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                            <Gamepad2
                                size={40}
                                className="mx-auto mb-3 opacity-40"
                            />
                            <p>Aún no has publicado ninguna reseña.</p>
                            <Link
                                href="/games"
                                className="mt-4 inline-block text-sm text-indigo-400 hover:text-indigo-300"
                            >
                                Ver juegos disponibles →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    onDelete={(id) => setConfirmId(id)}
                                    deleting={deletingId === review.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

/* ── ReviewCard ─────────────────────────────────────── */

function ReviewCard({ review, onDelete, deleting }) {
    const editLimitReached = review.edit_count >= 2;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20">
            <div className="flex items-start justify-between gap-4">
                {/* Info del juego */}
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/games/${review.game_id}`}
                        className="text-lg font-semibold text-white transition hover:text-indigo-300"
                    >
                        {review.game?.title ?? `Juego #${review.game_id}`}
                    </Link>

                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {review.content}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>
                            Editada {review.edit_count}/2{' '}
                            {editLimitReached && (
                                <span className="text-amber-400">
                                    (límite alcanzado)
                                </span>
                            )}
                        </span>
                        <span>·</span>
                        <span>
                            {new Date(review.created_at).toLocaleDateString(
                                'es-MX',
                            )}
                        </span>
                    </div>
                </div>

                {/* Rating + acciones */}
                <div className="flex shrink-0 flex-col items-end gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/15 px-3 py-1 text-sm font-bold text-yellow-300">
                        <Star size={13} /> {review.rating}/10
                    </span>

                    <div className="flex gap-2">
                        {!editLimitReached && (
                            <Link
                                href={`/games/${review.game_id}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                            >
                                <Pencil size={12} /> Editar
                            </Link>
                        )}
                        <button
                            disabled={deleting}
                            onClick={() => onDelete(review.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                            <Trash2 size={12} /> {deleting ? '…' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── StatCard ───────────────────────────────────────── */

const colorMap = {
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
};

function StatCard({ label, value, color }) {
    return (
        <div className={`rounded-2xl border p-5 ${colorMap[color]}`}>
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs opacity-80">{label}</p>
        </div>
    );
}

/* ── ConfirmModal ────────────────────────────────────── */

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
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />
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
