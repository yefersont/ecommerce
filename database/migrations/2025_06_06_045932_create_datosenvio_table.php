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
        Schema::create('datosenvio', function (Blueprint $table) {
            $table->integer('idDatosEnvio', true);
            $table->integer('Usuarios_idUsuarios')->index('fk_datosenvio_usuarios');
            $table->integer('Identificacion');
            $table->string('Telefono', 20);
            $table->string('Correo', 45);
            $table->bigInteger('Departamentos_idDepartamentos')->index('fk_datosenvio_departamentos');
            $table->bigInteger('Ciudades_idCiudades')->index('fk_datosenvio_ciudades');
            $table->string('Direccion');
            $table->string('DireccionAlternativa')->nullable();
            $table->string('CodigoPostal', 20)->nullable();
            $table->string('Observaciones', 500)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('datosenvio');
    }
};
