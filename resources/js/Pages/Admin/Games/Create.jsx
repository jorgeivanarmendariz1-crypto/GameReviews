import { Head, router, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        cover: null,
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/games', { forceFormData: true });
    };

    return (
        <>
            <Head title="Crear juego" />
            <div className="min-h-screen p-10 text-white">
                <h1 className="text-3xl font-bold mb-6">Crear juego</h1>

                <form onSubmit={submit} className="max-w-xl space-y-4">
                    <div>
                        <label className="text-sm">Título</label>
                        <input
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div className="text-red-400 text-sm mt-1">{errors.title}</div>}
                    </div>

                    <div>
                        <label className="text-sm">Descripción</label>
                        <textarea
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none"
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm">Portada</label>
                        <input
                            type="file"
                            className="mt-2 block w-full text-sm"
                            onChange={(e) => setData('cover', e.target.files[0])}
                        />
                        {errors.cover && <div className="text-red-400 text-sm mt-1">{errors.cover}</div>}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                        />
                        <span>Abrir para reseñas</span>
                    </div>

                    <button
                        disabled={processing}
                        className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-60"
                    >
                        Crear
                    </button>
                </form>
            </div>
        </>
    );
}
