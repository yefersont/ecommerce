<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HistorialBusqueda;

class HistorialBusquedaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($usuario_id)
    {
        $historial = HistorialBusqueda::where('usuario_id', $usuario_id)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($historial);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|exists:usuarios,idUsuarios',
            'termino_busqueda' => 'required|string|max:255',
        ]);

        $historial = new HistorialBusqueda();
        $historial->usuario_id = $request->usuario_id;
        $historial->termino_busqueda = $request->termino_busqueda;
        $historial->fecha = now();
        $historial->save();


        return response()->json(['message' => 'Búsqueda guardada'], 201);
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
