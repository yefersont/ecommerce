<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Product::all();

            // Convertir la imagen a base64 si está presente
        foreach ($productos as $producto) {
            if ($producto->Imagen) {
                $producto->Imagen = base64_encode($producto->Imagen);
            }
        }
        return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        $request->validate([

            'Nombre' => 'required|string',
            'Descripcion' => 'required|string',
            'Categoria_idCategoria' => 'required|exists:categoria,idCategoria',
            'Precio' => 'required|numeric',
            'Stock' => 'required|numeric',
            'Imagen' => 'required|image|max:2048'

        ]);

        $producto = new Product();
        $producto->Nombre = $request->Nombre;
        $producto->Descripcion = $request->Descripcion;
        $producto->Categoria_idCategoria = $request->Categoria_idCategoria;
        $producto->Precio = $request->Precio;
        $producto->Stock = $request->Stock;

        if ($request->hasFile('Imagen')) {
            $producto->Imagen = file_get_contents($request->file('Imagen')->getRealPath());
        }

        $producto->save();

        return response()->json([
            'message' => 'Producto registrado exitosamente'
        ], 201);


    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $producto = Product::find($id);
    
        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
    
        if ($producto->Imagen) {
            $producto->Imagen = base64_encode($producto->Imagen);
        }
    
        return response()->json($producto, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }

    public function porCategoria($id)
    {
        $productos = Product::where('Categoria_idCategoria', $id)->get();
        foreach ($productos as $producto) {
            if ($producto->Imagen) {
                $producto->Imagen = base64_encode($producto->Imagen);
            }
        }

        return response()->json($productos);
    }

    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'Nombre' => 'required|string',
            'Descripcion' => 'required|string',
            'Categoria_idCategoria' => 'required|exists:categoria,idCategoria',
            'Precio' => 'required|numeric',
            'Stock' => 'required|numeric',
            'Imagen' => $request->hasFile('Imagen') ? 'image|max:2048' : '',

        ]);
    
        $product = Product::findOrFail($id);
    
        if ($request->hasFile('Imagen')) {
            $product->Imagen = file_get_contents($request->file('Imagen')->getRealPath());
        }
    
        $camposActualizar = [
            'Nombre' => $request->Nombre,
            'Descripcion' => $request->Descripcion,
            'Categoria_idCategoria' => $request->Categoria_idCategoria,
            'Precio' => $request->Precio,
            'Stock' => $request->Stock,
        ];
    
        if ($request->hasFile('Imagen')) {
            $camposActualizar['Imagen'] = $product->Imagen;
        }
    
        $product->update($camposActualizar);
    
        return response()->json(['message' => 'Producto actualizado correctamente']);
    }
    
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $producto)
    {
        try {
            $producto->delete();
    
            return response()->json([
                "message" => "Producto eliminado con éxito"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Error al eliminar el producto",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
