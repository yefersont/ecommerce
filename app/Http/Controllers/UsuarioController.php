<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Exception;
use Illuminate\Http\Request;
use App\Models\Rolusuario;

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
        //
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
