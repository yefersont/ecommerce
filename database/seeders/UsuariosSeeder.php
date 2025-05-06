<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuariosSeeder extends Seeder
{
    public function run()
    {
        DB::table('usuarios')->updateOrInsert(
            ['User' => 'juan@admin.com'],
            [
                'Name' => 'Juan Pérez',
                'RollSuario_idTp_Rol' => 1,
                'Password' => Hash::make('admin123')
            ]
        );

        DB::table('usuarios')->updateOrInsert(
            ['User' => 'maria@cliente.com'],
            [
                'Name' => 'María López',
                'RollSuario_idTp_Rol' => 2,
                'Password' => Hash::make('cliente123')
            ]
        );

        DB::table('usuarios')->updateOrInsert(
            ['User' => 'carlos@cliente.com'],
            [
                'Name' => 'Carlos Ruiz',
                'RollSuario_idTp_Rol' => 2,
                'Password' => Hash::make('cliente456')
            ]
        );

        DB::table('usuarios')->updateOrInsert(
            ['User' => 'yefer@admin.com'],
            [
                'Name' => 'Yeferson Tello',
                'RollSuario_idTp_Rol' => 2,
                'Password' => Hash::make('yefer123')
            ]
        );

    }
}
