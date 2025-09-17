<?php

namespace App\Http\Controllers;

use App\Models\Datosenvio;
use Exception;
use Illuminate\Http\Request;


class DatosenvioController extends Controller
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
        //

        try {

            $request->validate([
                'Usuarios_idUsuarios' => 'required|numeric',
                'Identificacion' => 'required|numeric',
                'Telefono' => 'required|string',
                'Correo' => 'required|string',
                'Departamentos_idDepartamentos' => 'required|numeric',
                'Ciudades_idCiudades' => 'required|numeric',
                'Direccion' => 'required|string',
                'DireccionAlternativa' => 'nullable|string',
                'CodigoPostal' => 'nullable|string',
                'Observaciones' => 'nullable|string'
            ]);

            $datosenvio = new Datosenvio();
            $datosenvio->Usuarios_idUsuarios = $request->Usuarios_idUsuarios;
            $datosenvio->Identificacion = $request->Identificacion;
            $datosenvio->Telefono = $request->Telefono;
            $datosenvio->Correo = $request->Correo;
            $datosenvio->Departamentos_idDepartamentos = $request->Departamentos_idDepartamentos;
            $datosenvio->Ciudades_idCiudades = $request->Ciudades_idCiudades;
            $datosenvio->Direccion = $request->Direccion;
            $datosenvio->DireccionAlternativa = $request->DireccionAlternativa;
            $datosenvio->CodigoPostal = $request->CodigoPostal;
            $datosenvio->Observaciones = $request->Observaciones;
            $datosenvio->save();

            return response()->json([
                'message' => 'Datos de envío guardados correctamente.',
                'idDatosEnvio' => $datosenvio->idDatosEnvio
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'No se guardaron los datos.',
                'error' => $e
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $datos = Datosenvio::with(['departamento', 'ciudade'])
            ->where('Usuarios_idUsuarios', $id)
            ->get();

        return response()->json($datos);
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
