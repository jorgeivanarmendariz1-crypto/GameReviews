<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Game;
use App\Models\Review;
use App\Policies\GamePolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\Facades\Gate;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Game::class, GamePolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
    }
}
