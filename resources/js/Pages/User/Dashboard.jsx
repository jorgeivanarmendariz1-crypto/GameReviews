import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="User Dashboard" />
            <div className="min-h-screen p-10 text-white">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Panel Usuario</h1>
                        <p className="text-sm text-slate-300">
                            {auth?.user?.email}
                        </p>
                    </div>

                    <button
                        onClick={() => router.post('/logout')}
                        className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <p className="mt-2 text-slate-300">
                    Aquí podrás ver juegos y publicar reseñas.
                </p>

                {/* Acciones Usuario */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/games"
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
                    >
                        Ver juegos
                    </Link>
                </div>
            </div>
        </>
    );
}
