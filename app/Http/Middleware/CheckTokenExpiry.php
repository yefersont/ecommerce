<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class CheckTokenExpiry
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $token = $request->bearerToken();

        if ($token) {
            $tokenModel = PersonalAccessToken::findToken($token);

            if ($tokenModel && $tokenModel->expires_at && now()->greaterThan($tokenModel->expires_at)) {
                return response()->json(['message' => 'Token expirado'], 401);
            }
        }

        return $next($request);

    }
}
