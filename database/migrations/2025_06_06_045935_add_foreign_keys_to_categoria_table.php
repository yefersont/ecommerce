<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categoria', function (Blueprint $table) {
            $table->foreign(['Status_idStatus'], 'categoria_ibfk_1')->references(['idStatus'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categoria', function (Blueprint $table) {
            $table->dropForeign('categoria_ibfk_1');
        });
    }
};
