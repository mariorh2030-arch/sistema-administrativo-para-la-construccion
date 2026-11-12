

export default function ObrasList({obras, onEdit, onDelete})
{
    return(
        <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Nombre obra</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Numero patronal</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Fecha inicio</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Fecha cierre</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Num. Trabajadores</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Monto</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {obras.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    No hay obras registradas
                                </td>
                            </tr>
                        ) : ( 
                            obras.map((obra) => (
                                <tr key={obra.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-4 ">{obra.nombreObra}</td>
                                    <td className="px-4 py-4 ">{obra.numeroPatronal}</td>
                                    <td className="px-4 py-4 ">{obra.fechaInicio?.split('T')[0]}</td>
                                    <td className="px-4 py-4 ">{obra.fechaCierre?.split('T')[0]}</td>
                                    <td className="px-4 py-4 ">{obra.numTrabajadores}</td>
                                    <td className="px-4 py-4 ">${obra.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 ">
                                        <button onClick={() => onDelete(obra.id)}>
                                            <img src="/public/btn_eliminar.png" alt="btn_eliminar" />
                                        </button>
                                        <button onClick={() => onEdit(obra)}>
                                            <img src="/public/btn_editar.png" alt="btn_editar" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}