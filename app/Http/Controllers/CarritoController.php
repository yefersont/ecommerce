<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use Exception;
use Illuminate\Http\Request;
use function Termwind\renderUsing;
use App\Models\Product;

class CarritoController extends Controller
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
            $request->validate([
                'Productos_idProducts' => 'required|integer',
                'Cantidad' => 'required|integer|min:1',
                'Usuarios_idUsuarios' => 'required|integer'
            ]);


            $producto = Product::findOrFail($request->Productos_idProducts);
            $carrito = Carrito::where('Productos_idProducts', $request->Productos_idProducts)
                ->where('Usuarios_idUsuarios', $request->Usuarios_idUsuarios)
                ->first();

            $cantidadExistente = $carrito ? $carrito->Cantidad : 0;
            $cantidadTotal = $cantidadExistente + $request->Cantidad;

            if ($cantidadTotal > $producto->Stock) {
                return response()->json([
                    "Mensaje" => "No puedes agregar más productos de los que hay en stock. Stock disponible: {$producto->Stock}"
                ], 400);
            }

            if ($carrito) {
                $carrito->Cantidad = $cantidadTotal;
            } else {
                $carrito = new Carrito();
                $carrito->Productos_idProducts = $request->Productos_idProducts;
                $carrito->Cantidad = $request->Cantidad;
                $carrito->Usuarios_idUsuarios = $request->Usuarios_idUsuarios;
            }

            $carrito->save();

            return response()->json([
                "Mensaje" => "Producto agregado al carrito con éxito"
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "Mensaje" => 'Error al agregar el producto al carrito: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(Carrito $carrito)
    {
        //
    }

    public function ShowbyUser($idUsuario)
    {

        $carritos = Carrito::with('product')
            ->where('Usuarios_idUsuarios', $idUsuario)
            ->get()
            ->map(function ($item) {
                if ($item->product && $item->product->Imagen) {
                    $item->product->Imagen = base64_encode($item->product->Imagen);
                }
                return $item;
            });
        return response()->json($carritos);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carrito $carrito)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carrito $carrito)
    {
        //
    }

    public function vaciar($idUsuario)
    {
        try {
            Carrito::where('Usuarios_idUsuarios', $idUsuario)->delete();

            return response()->json([
                'Message' => 'Carrito vaciado con éxito'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'Message' => 'Error al vaciar el carrito',
                'Error' => $e->getMessage()
            ], 500);
        }
    }

    public function eliminarProducto($idUsuario, $idProducto)
    {
        try {
            $eliminado = Carrito::where('Usuarios_idUsuarios', $idUsuario)
                ->where('Productos_idProducts', $idProducto)
                ->delete();

            if ($eliminado) {
                return response()->json([
                    'message' => 'Producto eliminado del carrito'
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Producto no encontrado en el carrito'
                ], 404);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el producto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
