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
        Schema::table('carrito', function (Blueprint $table) {
            $table->foreign(['Productos_idProducts'], 'carrito_ibfk_1')->references(['idProductos'])->on('products')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['Usuarios_idUsuarios'], 'carrito_ibfk_2')->references(['idUsuarios'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carrito', function (Blueprint $table) {
            $table->dropForeign('carrito_ibfk_1');
            $table->dropForeign('carrito_ibfk_2');
        });
    }
};
