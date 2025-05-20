import React, { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import { href } from "react-router-dom";

const Usuarios = () => {
    // se definen las variables papra obtener los datos
    const [usuarios, setUsuarios] = useState([]);
    const [filtering, setFiltering] = useState("");

    //  Se definen las claves de las tablas
    const columns = [
        { accessorKey: "idUsuarios", header: "ID", },
        { accessorKey: "Name", header: "Nombre", },
        { accessorKey: "User", header: "Usuario" },
        { accessorKey: "rolusuario", header: "Rol" },
        {
            header: "Opciones",

            cell: ({ row }) => (
                <div>
                    <button
                        className="px-5 py-1 bg-yellow-500 text-white rounded  hover:bg-yellow-200 mr-4 ml-3"

                    >
                        Editar</button>
                    <button
                        className="px-5 py-1 bg-red-500 text-white rounded hover:bg-red-200 ml-4 mr-3"
                    >
                        Eliminar</button>
                </div>
            )
        }
    ];

    //  Funciones de la paginacion 
    const table = useReactTable({
        data: usuarios,
        columns,
        state: {
            globalFilter: filtering,
        },
        onGlobalFilterChange: setFiltering,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 9 },
        },
    });

    // Funcion para Llamar a lo usarios
    const fetchUsuarios = () => {
        axios
            .get(`http://127.0.0.1:8000/api/usuarios`)
            .then((response) => {
                setUsuarios(response.data.Usuarios);
                console.log(response.data.Usuarios);
            })
            .catch((error) => {
                console.error("Hubo un error al extraer los usuarios", error);
            });
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="p-10">
            {/* Encabezado y barra de búsqueda */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold">Usuarios</h1>
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="p-1 border rounded w-64"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                />
            </div>

            {/* Tabla de Usuarios  */}

            <table className="w-full border-collapse border text-center">
                <thead className="bg-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="p-2 border">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-100">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* Paginacion */}

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span>
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Usuarios;
