<?php

namespace App\Http\Controllers;

use App\Models\Ciudade;
use Illuminate\Http\Request;

class CiudadesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function porDepartamento($id)
    {

        $ciudad = Ciudade::where('departamento_id', $id)->get();

        return response()->json($ciudad);
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
