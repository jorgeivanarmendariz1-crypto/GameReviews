import { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Star, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

export default function Show({ game, reviews: initialReviews }) {
    const { auth, errors } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [confirmReviewId, setConfirmReviewId] = useState(null);

    // Lista de reseñas en estado local para poder agregar las que
    // llegan por WebSocket sin recargar la página
    const [reviews, setReviews] = useState(initialReviews ?? []);

    // Sincronizar estado local cuando Inertia recarga los props
    // (ocurre después de publicar una reseña propia)
    useEffect(() => {
        setReviews(initialReviews ?? []);
    }, [initialReviews]);

    /**
     * Suscripción al canal público "game.{id}" via Laravel Echo + Reverb.
     * Cuando otro usuario publica una reseña, el evento "review.posted"
     * llega aquí y la agregamos al principio de la lista en tiempo real.
     *
     * toOthers() en el backend evita que el propio autor la reciba dos veces.
     */
    useEffect(() => {
        if (typeof window.Echo === 'undefined') return;

        const channel = window.Echo.channel(`game.${game.id}`);

        channel.listen('.review.posted', (payload) => {
            setReviews((prev) => {
                // Evitar duplicados si el mismo evento llega dos veces
                if (prev.some((r) => r.id === payload.id)) return prev;
                return [payload, ...prev];
            });
        });

        channel.listen('.review.deleted', (payload) => {
            setReviews((prev) => prev.filter((r) => r.id !== payload.id));
        });

        return () => {
            window.Echo.leaveChannel(`game.${game.id}`);
        };
    }, [game.id]);

    const { data, setData, post, processing, reset } = useForm({
        game_id: game.id,
        rating: 1,
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            router.put(`/reviews/${editingId}`, data, {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                },
            });
        } else {
            post('/reviews', {
                onSuccess: () => {
                    reset();
                    router.reload({ only: ['reviews'] });
                },
            });
        }
    };

    const handleDeleteConfirmed = () => {
        if (!confirmReviewId) return;
        router.delete(`/reviews/${confirmReviewId}`, {
            onFinish: () => setConfirmReviewId(null),
        });
    };

    return (
        <AppLayout>
            <Head title={game.title} />

            {/* Modal confirmación eliminar reseña */}
            {confirmReviewId && (
                <ConfirmModal
                    title="Eliminar reseña"
                    message="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setConfirmReviewId(null)}
                    danger
                />
            )}

            {game.cover_path && (
                <img
                    src={`/storage/${game.cover_path}`}
                    alt={game.title}
                    className="h-80 w-full object-cover"
                />
            )}

            <div className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-4xl">
                    {/* GAME INFO */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h1 className="text-3xl font-bold">{game.title}</h1>
                        <p className="mt-2 text-slate-300">
                            {game.description}
                        </p>
                    </div>

                    {/* FORM REVIEW */}
                    <form
                        onSubmit={submit}
                        className={`mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl ${
                            errors.content ? 'animate-shake border-red-500' : ''
                        }`}
                    >
                        <h2 className="text-xl font-semibold">
                            {editingId ? 'Editar reseña' : 'Escribir reseña'}
                        </h2>

                        {/* RATING */}
                        <div className="mt-4">
                            <label className="text-sm text-slate-300">
                                Calificación (1-10)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={data.rating}
                                onChange={(e) =>
                                    setData('rating', Number(e.target.value))
                                }
                                className="mt-2 w-full rounded-xl bg-white/5 p-2 text-white"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="mt-4">
                            <label className="text-sm text-slate-300">
                                Reseña
                            </label>
                            <textarea
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                className="mt-2 w-full rounded-xl bg-white/5 p-3 text-white"
                                rows="4"
                                placeholder="Escribe tu opinión..."
                            />
                            {errors.content && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500"
                            >
                                {editingId ? 'Guardar cambios' : 'Publicar'}
                            </button>

                            {/* Cancelar edición */}
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setEditingId(null);
                                    }}
                                    className="rounded-xl bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    {/* REVIEWS LIST */}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold">
                            Reseñas ({reviews.length})
                        </h2>

                        {reviews.length === 0 && (
                            <p className="text-slate-400">
                                No hay reseñas todavía.
                            </p>
                        )}

                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-300">
                                        {review.author ??
                                            review.user?.name ??
                                            review.user?.email}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-yellow-400">
                                        <Star size={14} /> {review.rating}
                                    </span>
                                </div>

                                <p className="mt-2 text-white">
                                    {review.content}
                                </p>

                                {/* Botones solo si es el dueño de la reseña */}
                                {review.user_id === auth.user.id && (
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(review.id);
                                                setData(
                                                    'content',
                                                    review.content,
                                                );
                                                setData(
                                                    'rating',
                                                    review.rating,
                                                );
                                            }}
                                            className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                                        >
                                            <Pencil size={13} /> Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                setConfirmReviewId(review.id)
                                            }
                                            className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={13} /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
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
