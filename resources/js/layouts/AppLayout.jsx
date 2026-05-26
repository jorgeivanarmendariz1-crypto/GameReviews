import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

/**
 * AppLayout — Navbar global compartida por todas las páginas autenticadas.
 *
 * Reemplaza al AuthenticatedLayout original de Laravel (que usaba bg-gray-100
 * y estilos completamente distintos al resto del proyecto).
 *
 * Recibe `children` como contenido de la página y opcionalmente `title`
 * para el <head> (aunque cada página puede poner su propio <Head>).
 *
 * La navbar detecta automáticamente si el usuario es admin leyendo
 * auth.user.roles que ahora llega desde HandleInertiaRequests.
 */
export default function AppLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const isAdmin = Array.isArray(user?.roles)
        ? user.roles.includes('admin')
        : false;

    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => router.post('/logout');

    return (
        <div className="min-h-screen text-white">
            {/* ── NAVBAR ─────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="text-xl font-extrabold tracking-wide text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)] hover:text-indigo-300"
                    >
                        GameReviews
                    </Link>

                    {/* Links desktop */}
                    <div className="hidden items-center gap-6 sm:flex">
                        <NavItem href="/games">Juegos</NavItem>

                        {isAdmin ? (
                            <>
                                <NavItem href="/admin/games/create">
                                    Crear juego
                                </NavItem>
                                <NavItem href="/admin/petitions">
                                    Peticiones
                                </NavItem>
                            </>
                        ) : (
                            <NavItem href="/petitions/create">
                                Pedir juego
                            </NavItem>
                        )}
                    </div>

                    {/* Usuario + logout desktop */}
                    <div className="hidden items-center gap-4 sm:flex">
                        <span className="text-sm text-slate-400">
                            {user?.email}
                        </span>
                        {isAdmin && (
                            <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                                Admin
                            </span>
                        )}
                        <button
                            onClick={logout}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                        >
                            Salir
                        </button>
                    </div>

                    {/* Hamburger mobile */}
                    <button
                        className="text-slate-300 sm:hidden"
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Menú mobile */}
                {menuOpen && (
                    <div className="flex flex-col gap-3 border-t border-white/10 bg-black/60 px-6 py-4 sm:hidden">
                        <MobileNavItem
                            href="/games"
                            onClick={() => setMenuOpen(false)}
                        >
                            Juegos
                        </MobileNavItem>
                        {isAdmin ? (
                            <>
                                <MobileNavItem
                                    href="/admin/games/create"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Crear juego
                                </MobileNavItem>
                                <MobileNavItem
                                    href="/admin/petitions"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Peticiones
                                </MobileNavItem>
                            </>
                        ) : (
                            <MobileNavItem
                                href="/petitions/create"
                                onClick={() => setMenuOpen(false)}
                            >
                                Pedir juego
                            </MobileNavItem>
                        )}
                        <button
                            onClick={logout}
                            className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-slate-200"
                        >
                            Cerrar sesión — {user?.email}
                        </button>
                    </div>
                )}
            </nav>

            {/* Flash global */}
            {flash?.success && (
                <div className="mx-auto mt-4 max-w-7xl px-6">
                    <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="mx-auto mt-4 max-w-7xl px-6">
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {flash.error}
                    </div>
                </div>
            )}

            {/* Contenido de la página */}
            <main>{children}</main>
        </div>
    );
}

/* ── Helpers de navegación ───────────────────────────── */

function NavItem({ href, children }) {
    const { url } = usePage();
    const active = url.startsWith(href);

    return (
        <Link
            href={href}
            className={`text-sm font-medium transition ${
                active ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavItem({ href, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-sm font-medium text-slate-200 hover:text-white"
        >
            {children}
        </Link>
    );
}
