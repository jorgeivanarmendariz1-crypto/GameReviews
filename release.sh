#!/bin/sh
set -e

php artisan config:clear
php artisan cache:clear
php artisan migrate --force
php artisan storage:link

# Patch Reverb to work without pcntl
sed -i 's/return \[SIGINT, SIGTERM, SIGTSTP\];/return [];/' vendor/laravel/reverb/src/Servers/Reverb/Console/Commands/StartServer.php
