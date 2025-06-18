<?php

namespace App\Http\Controllers;

use App\Models\Metodospago;
use Illuminate\Http\Request;

class MetodoPagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $metodos = Metodospago::all();

        return response()->json([$metodos]);
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
    public function show(Metodospago $metodospago)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Metodospago $metodospago)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Metodospago $metodospago)
    {
        //
    }
}
