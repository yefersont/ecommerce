<?php



namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Resources\Payment;


class MercadoPagoController extends Controller
{
    //     public function webhook(Request $request)
    //     {
    //         // Establecer el token
    //         MercadoPagoConfig::setAccessToken(env('MERCADOPAGO_ACCESS_TOKEN'));

    //         // Verificar si es evento de pago
    //         if ($request->type === 'payment') {
    //             $paymentId = $request->input('data.id');

    //             $payment = Payment::findById($paymentId);

    //             \Log::info('🔔 Webhook recibido:', [
    //                 'id' => $payment->id,
    //                 'status' => $payment->status,
    //                 'payer_email' => $payment->payer->email,
    //                 'amount' => $payment->transaction_amount,
    //             ]);
    //         }

    //         return response()->json(['received' => true]);
    //     }
}
