<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Usuario
 * 
 * @property int $idUsuarios
 * @property string $Name
 * @property int $RollSuario_idTp_Rol
 * @property string $User
 * @property string $Password
 * 
 * @property Rolusuario $rolusuario
 * @property Collection|Carrito[] $carritos
 * @property Collection|Orden[] $ordens
 *
 * @package App\Models
 */
class Usuario extends Model
{
	protected $table = 'usuarios';
	protected $primaryKey = 'idUsuarios';
	public $timestamps = false;
	protected $casts = [
		'RollSuario_idTp_Rol' => 'int'
	];
	protected $fillable = [
		'Name',
		'RollSuario_idTp_Rol',
		'User',
		'Password'
	];
	public function datosenvios()
	{
		return $this->hasMany(Datosenvio::class, 'Usuarios_idUsuarios');
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

	public function tarjetas()
	{
		return $this->hasMany(Tarjeta::class, 'Usuarios_idUsuarios');
	}
}
