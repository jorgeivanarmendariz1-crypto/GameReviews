import { Head, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/AppLayout';

/**
 * Admin/Games/Edit
 *
 * Permite al admin modificar título, descripción, portada y estado (is_open)
 * de un juego existente.
 *
 * Usa POST en lugar de PUT/PATCH porque multipart/form-data (necesario para
 * subir archivos) no funciona correctamente con _method spoofing en Inertia.
 */
export default function Edit({ game }) {
    const [previewUrl, setPreviewUrl] = useState(
        game.cover_path ? `/storage/${game.cover_path}` : null,
    );
    const [removeCover, setRemoveCover] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: game.title ?? '',
        description: game.description ?? '',
        is_open: game.is_open ?? true,
        cover: null,
        remove_cover: false,
    });

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('cover', file);
        setPreviewUrl(URL.createObjectURL(file));
        setRemoveCover(false);
        setData('remove_cover', false);
    };

    const handleRemoveCover = () => {
        setRemoveCover(true);
        setPreviewUrl(null);
        setData('cover', null);
        setData('remove_cover', true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/games/${game.id}`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title={`Editar — ${game.title}`} />

            <div className="min-h-screen p-10 text-white">
                <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-3xl font-bold">Editar juego</h1>
                </div>
                <p className="mb-8 text-slate-400">
                    Modifica los datos del juego. Los cambios se reflejan de
                    inmediato en la biblioteca.
                </p>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* FORMULARIO */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Título */}
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

                        {/* Descripción */}
                        <div>
                            <label className="text-sm text-slate-300">
                                Descripción
                            </label>
                            <textarea
                                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                rows={5}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Portada */}
                        <div>
                            <label className="text-sm text-slate-300">
                                Portada
                            </label>

                            {/* Preview */}
                            {previewUrl && !removeCover ? (
                                <div className="relative mt-2 w-fit">
                                    <img
                                        src={previewUrl}
                                        alt="Portada actual"
                                        className="h-40 w-64 rounded-xl border border-white/10 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveCover}
                                        title="Eliminar portada"
                                        className="absolute -right-2 -top-2 rounded-full border border-red-500/30 bg-[#0f1117] p-1 text-red-400 hover:bg-red-500/20"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">
                                    Sin portada
                                </p>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                className="mt-3 block w-full text-sm text-slate-300"
                                onChange={handleCoverChange}
                            />
                            {errors.cover && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.cover}
                                </p>
                            )}
                        </div>

                        {/* is_open */}
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
                                Abierto para reseñas
                            </label>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-3 pt-2">
                            <button
                                disabled={processing}
                                className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                            >
                                {processing ? 'Guardando…' : 'Guardar cambios'}
                            </button>
                            <a
                                href={`/games/${game.id}`}
                                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-semibold text-white hover:bg-white/10"
                            >
                                Cancelar
                            </a>
                        </div>
                    </form>

                    {/* PANEL INFO */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
                                Información del juego
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">ID</span>
                                    <span className="font-mono text-white">
                                        #{game.id}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Estado actual
                                    </span>
                                    <span
                                        className={`font-medium ${game.is_open ? 'text-indigo-300' : 'text-slate-400'}`}
                                    >
                                        {game.is_open ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Creado
                                    </span>
                                    <span className="text-white">
                                        {new Date(
                                            game.created_at,
                                        ).toLocaleDateString('es-MX')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Última modificación
                                    </span>
                                    <span className="text-white">
                                        {new Date(
                                            game.updated_at,
                                        ).toLocaleDateString('es-MX')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
