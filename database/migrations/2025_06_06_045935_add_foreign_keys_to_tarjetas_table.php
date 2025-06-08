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
        Schema::table('tarjetas', function (Blueprint $table) {
            $table->foreign(['Usuarios_idUsuarios'], 'tarjetas_ibfk_1')->references(['idUsuarios'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tarjetas', function (Blueprint $table) {
            $table->dropForeign('tarjetas_ibfk_1');
        });
    }
};
