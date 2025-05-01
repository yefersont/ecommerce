<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Rolusuario
 * 
 * @property int $idTp_Rol
 * @property string $Description
 * 
 * @property Collection|Usuario[] $usuarios
 *
 * @package App\Models
 */
class Rolusuario extends Model
{
	protected $table = 'rolusuario';
	protected $primaryKey = 'idTp_Rol';
	public $timestamps = false;

	protected $fillable = [
		'Description'
	];

	public function usuarios()
	{
		return $this->hasMany(Usuario::class, 'RollSuario_idTp_Rol');
	}
}
