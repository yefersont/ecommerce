<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Comentario;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\HistorialBusqueda;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Product::all();

        foreach ($productos as $producto) {
            if ($producto->Imagen) {
                $producto->Imagen = base64_encode($producto->Imagen);
            }
        }
        return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }

    public function buscar(Request $request)
    {

        $nombre = $request->input('nombre');

        $productos = Product::where('Nombre', 'like', '%' . $nombre . '%')->get();
        foreach ($productos as $producto) {
            if ($producto->Imagen) {
                $producto->Imagen = base64_encode($producto->Imagen);
            }
        }

        return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }

    public function filtrar(Request $request)

    {
        $query = Product::query();

        $usuarioId = $request->input('usuario_id');

        $sinFiltros = !$request->filled('Nombre') && !$request->filled('Categoria_idCategoria') &&
            !$request->filled('PrecioMin') && !$request->filled('PrecioMax');

        if ($sinFiltros && $usuarioId) {
            $historial = HistorialBusqueda::where('usuario_id', $usuarioId)
                ->orderBy('fecha', 'desc')
                ->take(10)
                ->get();

            // Recolectar términos y categorías más comunes
            $categorias = $historial->pluck('categoria_id')->filter()->unique()->toArray();
            $terminos = $historial->pluck('termino_busqueda')->unique()->toArray();

            if (!empty($categorias)) {
                $query->whereIn('Categoria_idCategoria', $categorias);
            }

            if (!empty($terminos)) {
                $query->where(function ($q) use ($terminos) {
                    foreach ($terminos as $t) {
                        $q->orWhere('Nombre', 'like', '%' . $t . '%');
                    }
                });
            }

            // Mostrar en orden aleatorio
            $query->inRandomOrder();
        }

        // Filtros tradicionales
        if ($request->filled('Nombre')) {
            $query->where('Nombre', 'like', '%' . $request->Nombre . '%');
        }

        if ($request->filled('Categoria_idCategoria')) {
            $query->where('Categoria_idCategoria', $request->Categoria_idCategoria);
        }

        if ($request->filled('PrecioMin') && $request->filled('PrecioMax')) {
            $query->whereBetween('Precio', [$request->PrecioMin, $request->PrecioMax]);
        }

        $productos = $query->get();

        foreach ($productos as $producto) {
            if ($producto->Imagen) {
                $producto->Imagen = base64_encode($producto->Imagen);
            }
        }

        return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }

    /**
     * Display a listing of the resource.
     */
    // public function filtrar(Request $request)
    // {
    //     $query = Product::query();

    //     if ($request->filled('Nombre')) {
    //         $query->where('Nombre', 'like', '%' . $request->Nombre . '%');
    //     }

    //     if ($request->filled('Categoria_idCategoria')) {
    //         $query->where('Categoria_idCategoria', $request->Categoria_idCategoria);
    //     }

    //     if ($request->filled('PrecioMin') && $request->filled('PrecioMax')) {
    //         $query->whereBetween('Precio', [$request->PrecioMin, $request->PrecioMax]);
    //     }

    //     $productos = $query->get();

    //     foreach ($productos as $producto) {
    //         if ($producto->Imagen) {
    //             $producto->Imagen = base64_encode($producto->Imagen);
    //         }
    //     }

    //     return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    // }



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
        $producto = Product::with('comentarios.usuario')->find($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        if ($producto->Imagen) {
            $producto->Imagen = base64_encode($producto->Imagen);
        }

        return response()->json($producto, 200, [], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE);
    }
    public function porCategoria($idCategoria, Request $request)
    {
        $excluirId = $request->query('excluir'); // ?excluir=ID

        $productos = Product::where('Categoria_idCategoria', $idCategoria)
            ->when($excluirId, function ($query, $excluirId) {
                return $query->where('idProductos', '!=', $excluirId);
            })
            ->inRandomOrder()
            ->take(4)
            ->get();

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
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error al eliminar el producto",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
