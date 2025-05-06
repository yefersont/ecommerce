<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'idUsuarios';
    public $timestamps = false;

    protected $fillable = [
        'Name',
        'RollSuario_idTp_Rol',
        'User',
        'Password',
    ];

    protected $hidden = [
        'Password',
    ];

    protected $casts = [
        'Password' => 'hashed',
    ];

    public function getAuthIdentifierName()
    {
        return 'User';
    }

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function rolusuario()
    {
        return $this->belongsTo(Rolusuario::class, 'RollSuario_idTp_Rol');
    }

    public function carritos()
    {
        return $this->hasMany(Carrito::class, 'Usuarios_idUsuarios');
    }

    public function ordens()
    {
        return $this->hasMany(Orden::class, 'Usuarios_idUsuarios');
    }
}
