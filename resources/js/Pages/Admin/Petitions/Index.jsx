import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Index({ petitions }) {
    const { flash } = usePage().props;

    const approveForm = useForm({});
    const rejectForm = useForm({});

    const approve = (id) => {
        approveForm.post(`/admin/petitions/${id}/approve`, { preserveScroll: true });
    };

    const reject = (id) => {
        rejectForm.post(`/admin/petitions/${id}/reject`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Peticiones" />

            <div className="min-h-screen px-10 py-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Peticiones de juegos</h1>
                        <p className="text-slate-300">Aprueba o rechaza solicitudes de usuarios.</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard"
                            className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                        >
                            ← Dashboard
                        </Link>
                        <Link
                            href="/admin/games/create"
                            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                        >
                            Crear juego
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
                        {flash.success}
                    </div>
                )}

                <div className="mt-8 grid gap-4">
                    {petitions.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
                            No hay peticiones.
                        </div>
                    )}

                    {petitions.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-semibold">{p.title}</h2>
                                        <span
                                            className={
                                                "rounded-full px-3 py-1 text-xs font-semibold " +
                                                (p.status === "pending"
                                                    ? "bg-yellow-500/15 text-yellow-200 border border-yellow-500/30"
                                                    : p.status === "approved"
                                                    ? "bg-green-500/15 text-green-200 border border-green-500/30"
                                                    : "bg-red-500/15 text-red-200 border border-red-500/30")
                                            }
                                        >
                                            {p.status}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-slate-300">
                                        <span className="text-slate-200 font-medium">Usuario:</span>{" "}
                                        {p.user?.name} ({p.user?.email})
                                    </p>

                                    {p.reason && (
                                        <p className="mt-3 text-slate-200">
                                            <span className="text-slate-300">Razón:</span> {p.reason}
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-slate-400">
                                        {p.created_at}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        disabled={p.status !== "pending" || approveForm.processing}
                                        onClick={() => approve(p.id)}
                                        className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                                    >
                                        Aprobar
                                    </button>

                                    <button
                                        disabled={p.status !== "pending" || rejectForm.processing}
                                        onClick={() => reject(p.id)}
                                        className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
