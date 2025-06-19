<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // Procesa la respuesta de Google

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $usuario = User::where('User', $googleUser->getEmail())->first();

            if (!$usuario) {
                $usuario = User::create([
                    'Name' => $googleUser->getName(),
                    'RollSuario_idTp_Rol' => 2,
                    'User' => $googleUser->getEmail(),
                    'Password' => bcrypt(Str::random(16)),
                    'google_id' => $googleUser->getId(),
                ]);
            }

            $tokenResult = $usuario->createToken('auth_token');
            $token = $tokenResult->plainTextToken;

            $tokenModel = $usuario->tokens()->latest()->first();
            $tokenModel->expires_at = now()->addHours(2);
            $tokenModel->save();


            return redirect("http://127.0.0.1:8000/google/callback?token=$token");
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'No se pudo autenticar con Google',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
