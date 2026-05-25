<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        // Si es admin
        if ($user->hasRole('admin')) {
            // Utilizando esto funciona bien
            return Inertia::render('Admin/Dashboard');
        }
        // Si es user normal
        return Inertia::render('User/Dashboard');
    }
}
