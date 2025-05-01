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
        Schema::create('carrito', function (Blueprint $table) {
            $table->integer('idCarrito', true);
            $table->integer('Productos_idProducts')->index('productos_idproducts');
            $table->integer('Cantidad')->default(1);
            $table->integer('Usuarios_idUsuarios')->index('usuarios_idusuarios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrito');
    }
};
