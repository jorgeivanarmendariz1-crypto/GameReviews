import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';

/**
 * Admin/Dashboard
 *
 * Recibe del DashboardController:
 *   - totalGames       → total de juegos registrados
 *   - openGames        → juegos con is_open = true
 *   - pendingPetitions → peticiones en estado 'pending'
 *   - totalReviews     → total de reseñas en la plataforma
 *   - recentPetitions  → últimas 5 peticiones para vista rápida
 */
export default function Dashboard({
    totalGames = 0,
    openGames = 0,
    pendingPetitions = 0,
    totalReviews = 0,
    recentPetitions = [],
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Head title="Panel Admin" />

            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white">
                        Panel{' '}
                        <span className="text-indigo-400">Administrador</span>
                    </h1>
                    <p className="mt-2 text-slate-400">{auth?.user?.email}</p>
                </div>

                {/* Stats grid */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        label="Juegos totales"
                        value={totalGames}
                        color="indigo"
                        icon="🎮"
                    />
                    <StatCard
                        label="Juegos abiertos"
                        value={openGames}
                        color="green"
                        icon="✅"
                    />
                    <StatCard
                        label="Peticiones pendientes"
                        value={pendingPetitions}
                        color="yellow"
                        icon="📋"
                    />
                    <StatCard
                        label="Reseñas totales"
                        value={totalReviews}
                        color="purple"
                        icon="✍️"
                    />
                </div>

                {/* Acciones rápidas */}
                <div className="mb-10 flex flex-wrap gap-3">
                    <Link
                        href="/admin/games/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    >
                        🎮 Crear juego
                    </Link>
                    <Link
                        href="/admin/petitions"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                    >
                        📋 Ver todas las peticiones
                    </Link>
                    <Link
                        href="/games"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                    >
                        🗂️ Ver biblioteca
                    </Link>
                </div>

                {/* Peticiones recientes */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            Peticiones recientes
                        </h2>
                        <Link
                            href="/admin/petitions"
                            className="text-sm text-indigo-400 hover:text-indigo-300"
                        >
                            Ver todas →
                        </Link>
                    </div>

                    {recentPetitions.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                            No hay peticiones pendientes.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentPetitions.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                                >
                                    <div>
                                        <p className="font-semibold text-white">
                                            {p.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {p.user?.name ?? p.user?.email} ·{' '}
                                            {new Date(
                                                p.created_at,
                                            ).toLocaleDateString('es-MX')}
                                        </p>
                                    </div>
                                    <StatusBadge status={p.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Helpers ─────────────────────────────────────────── */

const colorMap = {
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    green: 'border-green-500/30  bg-green-500/10  text-green-300',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
};

function StatCard({ label, value, color, icon }) {
    return (
        <div className={`rounded-2xl border p-5 ${colorMap[color]}`}>
            <p className="mb-1 text-2xl">{icon}</p>
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs opacity-80">{label}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',
        approved: 'bg-green-500/15  text-green-200  border-green-500/30',
        rejected: 'bg-red-500/15    text-red-200    border-red-500/30',
    };
    const labels = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] ?? styles.pending}`}
        >
            {labels[status] ?? status}
        </span>
    );
}
