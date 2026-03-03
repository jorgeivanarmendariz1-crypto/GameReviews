import { Head } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen p-10 text-white">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Panel Admin</h1>
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
                    Aquí podrás crear juegos y revisar peticiones.
                </p>

                <div className="mt-6 flex gap-3">
                    <Link
                        href="/admin/games/create"
                        className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                    >
                        Crear juego
                    </Link>

                    <Link
                        href="/admin/petitions"
                        className="rounded-xl bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20"
                    >
                        Ver peticiones
                    </Link>
                </div>
            </div>
        </>
    );
}
