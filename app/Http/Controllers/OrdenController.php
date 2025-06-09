<?php

namespace App\Http\Controllers;

use App\Models\Orden;
use App\Models\Status;
use Exception;
use Illuminate\Http\Request;

class OrdenController extends Controller
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


        try {
            // Validar los datos recibidos
            $request->validate([
                'Total' => 'required|numeric',
                'MetodosPago_idMetodosPago' => 'required|numeric',
                'Tarjetas_idTarjetas' => 'nullable|numeric',
                'Datosenvio_idDatosenvio' => 'required|numeric',
            ]);

            $status = 4;

            $orden = new Orden();
            $orden->Fecha = now();
            $orden->Total = $request->Total;
            $orden->MetodosPago_idMetodosPago = $request->MetodosPago_idMetodosPago;
            $orden->Tarjetas_idTarjetas = $request->Tarjetas_idTarjetas;
            $orden->Status_idStatus = $status;
            $orden->Datosenvio_idDatosenvio = $request->Datosenvio_idDatosenvio;

            $orden->save();

            return response()->json(
                [
                    'mensaje' => 'Orden creada correctamente',
                    'orden' => $orden
                ],
                201
            );
        } catch (Exception $e) {
            return response()->json(
                [
                    'mensaje' => 'Error al crear la orden',
                    'orden' => $orden
                ],
                501
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Orden $orden)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orden $orden)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orden $orden)
    {
        //
    }
}
