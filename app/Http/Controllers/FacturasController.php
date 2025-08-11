<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class FacturasController extends Controller
{
    public function generarFactura(Request $request)
    {
        $html = $request->input('html');

        if (!$html) {
            return response()->json(['error' => 'No se envió HTML'], 400);
        }

        $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="factura.pdf"');
    }
}
