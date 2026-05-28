import { Head, router, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

/**
 * Admin/Games/Create
 *
 * Mejoras:
 *  - Muestra un panel colapsable con los juegos que ya están abiertos
 *    para que el admin evite crear duplicados.
 */
export default function Create({ openGames = [], prefillTitle = '' }) {
    const [showOpenGames, setShowOpenGames] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: prefillTitle,
        description: '',
        cover: null,
        is_open: true,
    });

    // Si venimos de una aprobación, el título viene pre-cargado
    const fromApproval = prefillTitle !== '';

    const submit = (e) => {
        e.preventDefault();
        post('/admin/games', { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title="Crear juego" />
            <div className="min-h-screen p-10 text-white">
                <h1 className="mb-2 text-3xl font-bold">Crear juego</h1>
                <p className="mb-8 text-slate-400">
                    Añade un nuevo juego a la biblioteca.
                </p>

                {fromApproval && (
                    <div className="mb-8 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-4 text-sm text-indigo-200">
                        Petición aprobada — el título{' '}
                        <span className="font-semibold text-white">
                            "{prefillTitle}"
                        </span>{' '}
                        ha sido pre-cargado. Completa los campos restantes y
                        publica el juego.
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* FORMULARIO */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="text-sm text-slate-300">
                                Título
                            </label>
                            <input
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Descripción
                            </label>
                            <textarea
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Portada
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-sm text-slate-300"
                                onChange={(e) =>
                                    setData('cover', e.target.files[0])
                                }
                            />
                            {errors.cover && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.cover}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_open"
                                type="checkbox"
                                checked={data.is_open}
                                onChange={(e) =>
                                    setData('is_open', e.target.checked)
                                }
                                className="h-4 w-4 rounded"
                            />
                            <label
                                htmlFor="is_open"
                                className="cursor-pointer text-sm text-slate-300"
                            >
                                Abrir para reseñas al crear
                            </label>
                        </div>

                        <button
                            disabled={processing}
                            className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {processing ? 'Creando…' : 'Crear juego'}
                        </button>
                    </form>

                    {/* PANEL JUEGOS ABIERTOS */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowOpenGames((v) => !v)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/10"
                        >
                            <div>
                                <p className="font-semibold text-white">
                                    Juegos abiertos actualmente
                                </p>
                                <p className="text-xs text-slate-400">
                                    {openGames.length} juego
                                    {openGames.length !== 1 ? 's' : ''} abierto
                                    {openGames.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            {showOpenGames ? (
                                <ChevronUp
                                    size={18}
                                    className="text-slate-400"
                                />
                            ) : (
                                <ChevronDown
                                    size={18}
                                    className="text-slate-400"
                                />
                            )}
                        </button>

                        {showOpenGames && (
                            <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-white/5">
                                {openGames.length === 0 ? (
                                    <p className="p-5 text-sm text-slate-400">
                                        No hay juegos abiertos actualmente.
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-white/5">
                                        {openGames.map((g) => (
                                            <li
                                                key={g.id}
                                                className="flex items-center justify-between px-5 py-3"
                                            >
                                                <span className="text-sm text-slate-200">
                                                    {g.title}
                                                </span>
                                                <a
                                                    href={`/games/${g.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                                >
                                                    Ver →
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
