<?php

namespace App\Http\Controllers;

use App\Models\Datosenvio;
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

    public function OrdenPorUsuario($idUsuario)
    {

        try {

            $datosenvio = Datosenvio::where('Usuarios_idUsuarios', $idUsuario)->pluck('idDatosEnvio');

            $ordenes = Orden::with([
                'ordendetalles.product'
            ])
                ->whereIn('Datosenvio_idDatosenvio', $datosenvio)
                ->orderBy('Fecha', 'desc')->get();

            $ordenes->each(function ($orden) {
                $orden->ordendetalles->each(function ($detalle) {
                    $detalle->subtotal = $detalle->Cantidad * $detalle->PrecioUnitario;
                });
            });

            foreach ($ordenes as $orden) {
                foreach ($orden->ordendetalles as $detalle) {
                    $detalle->subtotal = $detalle->Cantidad * $detalle->PrecioUnitario;
                    if (!empty($detalle->product->Imagen)) {
                        $detalle->product->Imagen = base64_encode($detalle->product->Imagen);
                    }
                }
            }

            return response()->json($ordenes, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
        } catch (Exception $e) {
            return response()->json([
                "Error" => $e->getMessage()
            ]);
        }
    }

    public function InformacionCompra($idUsuario, $idOrden)
    {
        try {
            $orden = Orden::with([
                'ordendetalles.product',
                'datosenvio',
                'metodospago'
            ])
                ->where('idOrden', $idOrden)
                ->whereHas('datosenvio', function ($query) use ($idUsuario) {
                    $query->where('Usuarios_idUsuarios', $idUsuario);
                })
                ->firstOrFail();

            // Calcular subtotales y codificar imagen
            foreach ($orden->ordendetalles as $detalle) {
                $detalle->subtotal = $detalle->Cantidad * $detalle->PrecioUnitario;

                if (!empty($detalle->product->Imagen)) {
                    $detalle->product->Imagen = base64_encode($detalle->product->Imagen);
                }
            }

            return response()->json($orden, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
        } catch (\Exception $e) {
            return response()->json([
                "error" => "No se encontró la orden o no pertenece a este usuario",
                "detalle" => $e->getMessage()
            ], 404);
        }
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
                    'idOrden' => $orden->idOrden
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
