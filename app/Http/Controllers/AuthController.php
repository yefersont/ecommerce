<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'User' => 'required|string',
            'Password' => 'required|string',
        ]);
    
        $credentials = [
            'User' => $request->input('User'),
            'password' => $request->input('Password'),
        ];
    
        Log::info('Intento de login', ['User' => $credentials['User']]);
    
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
    
            $tokenResult = $user->createToken('auth_token');
            $token = $tokenResult->plainTextToken;
    
            // Establecer expiración en 2 horas
            $tokenResult->accessToken->expires_at = now()->addHours(2);
            $tokenResult->accessToken->save();
    
            Log::info('Token generado', ['token' => $token]);
    
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'User' => $user,
                'Mensaje' => 'Usuario Logueado'
            ]);
        }
    
        Log::warning('Login fallido', ['User' => $credentials['User']]);
    
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }
}
