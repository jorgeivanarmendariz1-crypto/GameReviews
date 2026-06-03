
#!/bin/sh
set -e
composer dump-autoload --optimize
php artisan migrate --force
php artisan storage:link
