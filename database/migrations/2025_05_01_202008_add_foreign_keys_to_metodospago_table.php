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
        Schema::table('metodospago', function (Blueprint $table) {
            $table->foreign(['Tarjetas_idTarjetas'], 'metodospago_ibfk_1')->references(['idTarjetas'])->on('tarjetas')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('metodospago', function (Blueprint $table) {
            $table->dropForeign('metodospago_ibfk_1');
        });
    }
};
