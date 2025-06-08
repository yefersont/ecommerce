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
        Schema::table('datosenvio', function (Blueprint $table) {
            $table->foreign(['Ciudades_idCiudades'], 'fk_datosenvio_ciudades')->references(['idCiudades'])->on('ciudades')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['Departamentos_idDepartamentos'], 'fk_datosenvio_departamentos')->references(['idDepartamentos'])->on('departamentos')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['Usuarios_idUsuarios'], 'fk_datosenvio_usuarios')->references(['idUsuarios'])->on('usuarios')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('datosenvio', function (Blueprint $table) {
            $table->dropForeign('fk_datosenvio_ciudades');
            $table->dropForeign('fk_datosenvio_departamentos');
            $table->dropForeign('fk_datosenvio_usuarios');
        });
    }
};
