<?php

namespace App\Http\Controllers;

use App\Models\Tarjeta;
use Illuminate\Http\Request;

class TarjetaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function TarjetaPorUsuario($id)
    {

        $tarjeta = Tarjeta::where('Usuarios_idUsuarios', $id)->get();

        return response()->json($tarjeta);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'Description' => 'required|string',
                'Usuarios_idUsuarios' => 'required|integer',
                'Saldo' => 'required|integer'
            ]);

            $tarjeta = new Tarjeta();
            $tarjeta->Description = $request->Description;
            $tarjeta->Usuarios_idUsuarios = $request->Usuarios_idUsuarios;
            $tarjeta->Saldo = $request->Saldo;

            $tarjeta->save();

            return response()->json([
                'message' => 'Tarjeta creada exitosamente.',
                'tarjeta' => $tarjeta
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la tarjeta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Tarjeta $tarjeta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tarjeta $tarjeta)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarjeta $tarjeta)
    {
        //
    }
}
