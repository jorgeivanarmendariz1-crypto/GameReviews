
?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('petitions', 'reviewed_at')) {
            Schema::table('petitions', function (Blueprint $table) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            });
        }
    }
    public function down(): void
    {
        if (Schema::hasColumn('petitions', 'reviewed_at')) {
            Schema::table('petitions', function (Blueprint $table) {
                $table->dropColumn('reviewed_at');
            });
        }
    }
};
