import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/petitions');
    };

    return (
        <AppLayout>
            <Head title="Pedir juego" />
            <div className="min-h-screen p-10 text-white">
                <h1 className="mb-6 text-3xl font-bold">Pedir nuevo juego</h1>

                <form onSubmit={submit} className="max-w-xl space-y-4">
                    <div>
                        <label className="text-sm">Título del juego</label>
                        <input
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && (
                            <div className="mt-1 text-sm text-red-400">
                                {errors.title}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-sm">Razón (opcional)</label>
                        <textarea
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 outline-none"
                            rows={4}
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                        />
                    </div>

                    <button
                        disabled={processing}
                        className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500 disabled:opacity-60"
                    >
                        Enviar petición
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
