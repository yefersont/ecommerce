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
        Schema::create('orden', function (Blueprint $table) {
            $table->integer('idOrden', true);
            $table->dateTime('Fecha')->nullable()->useCurrent();
            $table->decimal('Total', 10);
            $table->integer('MetodosPago_idMetodosPago')->index('metodospago_idmetodospago');
            $table->integer('Tarjetas_idTarjetas')->nullable()->index('tarjetas_idtarjetas');
            $table->integer('Status_idStatus')->index('status_idstatus');
            $table->integer('Datosenvio_idDatosenvio')->index('datosenvio_iddatosenvio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden');
    }
};
