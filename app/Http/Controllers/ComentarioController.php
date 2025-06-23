<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentario;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try {
            $request->validate([
                'Comentario' => 'required|string|max:255',
                'Usuarios_idUsuarios' => 'required|integer',
                'Producto_idProducto' => 'required|integer',
                'Comentario_padre_id' => 'nullable|integer',
            ]);

            $comentario = new Comentario();
            $comentario->Comentario = $request->Comentario;
            $comentario->Usuarios_idUsuarios = $request->Usuarios_idUsuarios;
            $comentario->Producto_idProducto = $request->Producto_idProducto;
            $comentario->Comentario_padre_id = $request->Comentario_padre_id ?? null;
            $comentario->Fecha = now();
            $comentario->save();

            return response()->json([
                'message' => 'Comentario creado exitosamente',
                'comentario' => $comentario
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al guardar el comentario.',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
