import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

export default function Show({ game, reviews }) {
    const { auth, errors } = usePage().props;
    const [editingId, setEditingId] = useState(null);

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
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout>
            <Head title={game.title} />

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
                                        {review.user?.email}
                                    </span>
                                    <span className="text-yellow-400">
                                        ⭐ {review.rating}
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
                                            className="text-sm text-indigo-400 hover:text-indigo-300"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm('¿Eliminar reseña?')
                                                ) {
                                                    router.delete(
                                                        `/reviews/${review.id}`,
                                                    );
                                                }
                                            }}
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            Eliminar
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
