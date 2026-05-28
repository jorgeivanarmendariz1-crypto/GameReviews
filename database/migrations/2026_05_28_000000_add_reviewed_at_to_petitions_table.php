<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * La columna reviewed_at existe en la migración original de petitions
 * pero no fue aplicada a la base de datos (la tabla se creó antes de
 * que se añadiera la columna). Esta migración la agrega de forma segura.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('petitions', function (Blueprint $table) {
            if (!Schema::hasColumn('petitions', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('petitions', function (Blueprint $table) {
            if (Schema::hasColumn('petitions', 'reviewed_at')) {
                $table->dropColumn('reviewed_at');
            }
        });
    }
};
