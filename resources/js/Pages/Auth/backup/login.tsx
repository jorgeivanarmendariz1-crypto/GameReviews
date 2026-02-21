import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

// Importamos route desde ziggy-js o confiamos en que esté global (típico en Laravel)
// Si te marca error en 'route', asegúrate de tener ziggy instalado.
// @ts-ignore
import { route } from 'ziggy-js';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Iniciar sesión"
            description="Ingresa tu correo y contraseña para acceder a GameReviews"
        >
            <Head title="Inicio de sesión" />

            <div className="mb-8 flex justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-wide text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]">
                        GameReviews
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Analiza. Puntúa. Comparte.
                    </p>
                </div>
            </div>

            <Form
                method="post"
                action={route('login')}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div
                        className={`animate-fade-in flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-xl ${
                            errors.email || errors.password
                                ? 'animate-shake'
                                : ''
                        }`}
                    >
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="border-white/10 bg-white/5 text-white placeholder-gray-400 backdrop-blur-md focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-white/10 bg-white/5 text-white placeholder-gray-400 backdrop-blur-md focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-white"
                                >
                                    Recordarme
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 w-full bg-indigo-600 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tienes cuenta?{' '}
                                <TextLink href={route('register')} tabIndex={5}>
                                    Crear cuenta
                                </TextLink>
                            </div>
                        )}
                    </div>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
