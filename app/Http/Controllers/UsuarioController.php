<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Exception;
use Illuminate\Http\Request;
use App\Models\Rolusuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            $usuarios = Usuario::with('rolusuario')->get()->map(function ($usuario) {
                return [
                    'idUsuarios' => $usuario->idUsuarios,
                    'Name' => $usuario->Name,
                    'User' => $usuario->User,
                    'rolusuario' => $usuario->rolusuario->Description
                ];
            });
            return response()->json([
                'Usuarios' => $usuarios,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request)
    {
        try {
            $request->validate([
                'Name' => 'required|string',
                'RollSuario_idTp_Rol' => 'required|integer',
                'User' => 'required|string|unique:usuarios,User',
                'Password' => [
                    'required',
                    'string',
                    Password::min(8)->mixedCase()->numbers()->symbols(),
                ],
            ]);

            $usuario = new Usuario();
            $usuario->Name = $request->input('Name');
            $usuario->RollSuario_idTp_Rol = $request->input('RollSuario_idTp_Rol');
            $usuario->User = $request->input('User');
            $usuario->Password = Hash::make($request->input('Password'));
            $usuario->save();

            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'usuario' => $usuario
            ], 201);
        } catch (Exception $e) {

            return response()->json([
                'error' => 'Error al registrar el usuario',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Usuario $usuario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Usuario $usuario)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Usuario $usuario)
    {
        //
    }
}
