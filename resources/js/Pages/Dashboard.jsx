import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const isAdmin = user?.roles?.some((r) => r.name === 'admin'); // si ya mandas roles al front

    return (
        <>
            <Head title={isAdmin ? 'Admin Dashboard' : 'User Dashboard'} />

            <div className="min-h-screen px-10 py-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            {isAdmin ? 'Panel Admin' : 'Panel Usuario'}
                        </h1>
                        <p className="text-slate-300">{user?.email}</p>
                    </div>

                    {/* Logout */}
                    <form method="post" action="/logout">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                        <button
                            type="submit"
                            className="rounded-xl bg-white/10 px-5 py-2 text-white hover:bg-white/20"
                        >
                            Cerrar sesión
                        </button>
                    </form>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
                        {flash.success}
                    </div>
                )}

                {/* Acciones */}
                <div className="mt-10 flex flex-wrap gap-4">
                    {isAdmin ? (
                        <>
                            <Link
                                href="/admin/games/create"
                                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
                            >
                                Crear juego
                            </Link>

                            <Link
                                href="/admin/petitions"
                                className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
                            >
                                Ver peticiones
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/petitions/create"
                                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
                            >
                                Pedir nuevo juego
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
