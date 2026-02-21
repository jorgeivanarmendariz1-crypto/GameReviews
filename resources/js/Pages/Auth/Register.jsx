import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Crear cuenta" />

            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-wide text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]">
                            GameReviews
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Crea tu cuenta y empieza a reseñar.
                        </p>
                    </div>

                    {/* Card */}
                    <div
                        className={`animate-fade-in flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-xl ${
                            errors.name ||
                            errors.email ||
                            errors.password ||
                            errors.password_confirmation
                                ? 'animate-shake'
                                : ''
                        }`}
                    >
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm text-slate-200">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                    placeholder="Tu nombre"
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && (
                                    <div className="mt-2 text-sm text-red-400">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

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
                                    autoComplete="username"
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
                                <label className="block text-sm text-slate-200">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                    placeholder="Crea una contraseña"
                                    autoComplete="new-password"
                                    required
                                />
                                {errors.password && (
                                    <div className="mt-2 text-sm text-red-400">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm text-slate-200">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                                    placeholder="Repite tu contraseña"
                                    autoComplete="new-password"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="mt-2 text-sm text-red-400">
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full rounded-xl bg-indigo-600 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] disabled:opacity-60"
                            >
                                {processing
                                    ? 'Creando cuenta…'
                                    : 'Crear cuenta'}
                            </button>
                        </form>

                        <div className="text-center text-sm text-slate-300">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href="/login"
                                className="text-indigo-300 hover:text-indigo-200"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
