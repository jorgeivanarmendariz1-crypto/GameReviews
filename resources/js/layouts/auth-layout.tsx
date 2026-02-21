import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { useEffect, useState } from 'react';

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            <div className="absolute top-5 right-5">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white transition hover:bg-indigo-500"
                >
                    {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
                </button>
            </div>
            {children}
        </AuthLayoutTemplate>
    );
}
