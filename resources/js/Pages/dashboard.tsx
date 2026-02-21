import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background p-10 text-foreground">
            <h1 className="mb-8 text-4xl font-bold text-indigo-500">
                Panel de GameReviews
            </h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h2 className="mb-2 text-xl font-semibold">
                        Juegos registrados
                    </h2>
                    <p className="text-3xl font-bold text-indigo-400">12</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h2 className="mb-2 text-xl font-semibold">
                        Reseñas creadas
                    </h2>
                    <p className="text-3xl font-bold text-indigo-400">34</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h2 className="mb-2 text-xl font-semibold">
                        Usuarios activos
                    </h2>
                    <p className="text-3xl font-bold text-indigo-400">5</p>
                </div>
            </div>
        </div>
    );
}
