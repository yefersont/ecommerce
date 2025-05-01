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
        Schema::create('ordendetalle', function (Blueprint $table) {
            $table->integer('idOrdenDetalle', true);
            $table->integer('Orden_id')->index('orden_id');
            $table->integer('Producto_id')->index('producto_id');
            $table->integer('Cantidad');
            $table->decimal('PrecioUnitario', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordendetalle');
    }
};
