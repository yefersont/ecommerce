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
        Schema::table('ciudades', function (Blueprint $table) {
            $table->foreign(['departamento_id'], 'Ciudades_ibfk_1')->references(['idDepartamentos'])->on('departamentos')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ciudades', function (Blueprint $table) {
            $table->dropForeign('Ciudades_ibfk_1');
        });
    }
};
