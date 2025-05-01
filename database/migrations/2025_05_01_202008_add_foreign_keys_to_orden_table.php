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
        Schema::table('orden', function (Blueprint $table) {
            $table->foreign(['Usuarios_idUsuarios'], 'orden_ibfk_1')->references(['idUsuarios'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['MetodosPago_idMetodosPago'], 'orden_ibfk_2')->references(['idMetodosPago'])->on('metodospago')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['Status_idStatus'], 'orden_ibfk_3')->references(['idStatus'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orden', function (Blueprint $table) {
            $table->dropForeign('orden_ibfk_1');
            $table->dropForeign('orden_ibfk_2');
            $table->dropForeign('orden_ibfk_3');
        });
    }
};
