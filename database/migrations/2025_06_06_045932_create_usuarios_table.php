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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->integer('idUsuarios', true);
            $table->string('Name', 45);
            $table->integer('RollSuario_idTp_Rol')->index('rollsuario_idtp_rol');
            $table->string('User', 45)->unique('user');
            $table->string('Password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
