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
        Schema::table('ordendetalle', function (Blueprint $table) {
            $table->foreign(['Orden_id'], 'ordendetalle_ibfk_1')->references(['idOrden'])->on('orden')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['Producto_id'], 'ordendetalle_ibfk_2')->references(['idProductos'])->on('products')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordendetalle', function (Blueprint $table) {
            $table->dropForeign('ordendetalle_ibfk_1');
            $table->dropForeign('ordendetalle_ibfk_2');
        });
    }
};
