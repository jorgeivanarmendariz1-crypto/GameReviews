#!/bin/sh
set -e

php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link

# Apply Reverb patch for FrankenPHP (no pcntl)
cp vendor-patches/laravel/reverb/src/Servers/Reverb/Console/Commands/StartServer.php \
   vendor/laravel/reverb/src/Servers/Reverb/Console/Commands/StartServer.php
