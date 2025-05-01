<?php

namespace App\Http\Controllers;

use App\Models\Categorium;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return Categorium::all();
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
    public function show($id)
    {
        //

        $categoria = Categorium::findOrFail($id);

        if(!$categoria){
            
            return response()->json([
                'message' => 'Categoria no encontrada'
            ]);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categorium $categorium)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categorium $categorium)
    {
        //
    }
}
