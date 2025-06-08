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
        Schema::create('products', function (Blueprint $table) {
            $table->integer('idProductos', true);
            $table->string('Nombre');
            $table->string('Descripcion', 1000)->nullable();
            $table->integer('Categoria_idCategoria')->index('categoria_idcategoria');
            $table->decimal('Precio', 10);
            $table->integer('Stock')->nullable()->default(0);
            $table->binary('Imagen')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
