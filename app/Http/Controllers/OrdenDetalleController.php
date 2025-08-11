<?php

namespace App\Http\Controllers;

use App\Models\Ordendetalle;
use Illuminate\Http\Request;
use App\Models\Product;
use Exception;
use Illuminate\Support\Facades\Validator;


class OrdenDetalleController extends Controller
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
            $detalles = is_array($request->all()) ? $request->all() : [$request->all()];

            foreach ($detalles as $detalle) {
                // Validar
                $validator = Validator::make($detalle, [
                    'Orden_id' => 'required|numeric',
                    'Producto_id' => 'required|numeric',
                    'Cantidad' => 'required|numeric|min:1',
                    'PrecioUnitario' => 'required|numeric'
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'message' => 'Error de validación',
                        'errors' => $validator->errors()
                    ], 422);
                }

                // Obtener producto actual solo con lo necesario
                $producto = Product::select('idProductos', 'Stock', 'Nombre')
                    ->where('idProductos', $detalle['Producto_id'])
                    ->first();

                if (!$producto) {
                    return response()->json([
                        'message' => 'Producto no encontrado',
                    ], 404);
                }

                if ($producto->Stock < $detalle['Cantidad']) {
                    return response()->json([
                        'message' => "Stock insuficiente para el producto '{$producto->Nombre}'. Stock disponible: {$producto->Stock}",
                    ], 400);
                }

                // Guardar el detalle
                Ordendetalle::create([
                    'Orden_id' => $detalle['Orden_id'],
                    'Producto_id' => $detalle['Producto_id'],
                    'Cantidad' => $detalle['Cantidad'],
                    'PrecioUnitario' => $detalle['PrecioUnitario'],
                ]);

                // Descontar el stock sin afectar la imagen ni otros campos
                Product::where('idProductos', $detalle['Producto_id'])
                    ->decrement('Stock', $detalle['Cantidad']);
            }

            return response()->json([
                "message" => "Se insertaron los detalles correctamente y se actualizó el stock"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "Error" => "Error: " . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Ordendetalle $ordendetalle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ordendetalle $ordendetalle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ordendetalle $ordendetalle)
    {
        //
    }
}
