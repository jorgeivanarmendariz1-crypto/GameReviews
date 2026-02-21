import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-wide text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]">
                            GameReviews
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Analiza. Puntúa. Comparte.
                        </p>
                    </div>

                    {/* Card */}
                    <div
                        className={`animate-fade-in flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-xl ${errors.email || errors.password ? 'animate-shake' : ''
                            }`}
                    >
                        {status && (
                            <div className="text-center text-sm font-medium text-green-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="flex flex-col gap-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm text-slate-200">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                    placeholder="email@example.com"
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && (
                                    <div className="mt-2 text-sm text-red-400">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm text-slate-200">
                                        Contraseña
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-indigo-300 hover:text-indigo-200"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </div>

                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                    placeholder="Tu contraseña"
                                    autoComplete="current-password"
                                    required
                                />

                                {errors.password && (
                                    <div className="mt-2 text-sm text-red-400">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-3 text-sm text-slate-200">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 accent-indigo-500"
                                />
                                Recordarme
                            </label>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full rounded-xl bg-indigo-600 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] disabled:opacity-60"
                            >
                                {processing ? 'Ingresando…' : 'Iniciar sesión'}
                            </button>
                        </form>

                        <div className="text-center text-sm text-slate-300">
                            ¿No tienes cuenta?{' '}
                            <Link
                                href="/register"
                                className="text-indigo-300 hover:text-indigo-200"
                            >
                                Crear cuenta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
