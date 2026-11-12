import { useState, useEffect } from "react";
import ObrasForm from "../componentes/obrasForm.jsx";
import ObrasList from "../componentes/obrasList.jsx";
import ObraService from "../services/ObrasServices.js";


export default function Obras()
{
    const [isOpen, setIsOpen] = useState(false)
    const [sidebarAbierto, setSidebarAbierto] = useState(false)
    const [ListaObras, setListaObras] = useState([])
    const [patronal, setPatronal] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [idEdited, setIdEdited] = useState(null)
    const [obras, setObras] = useState({
        NombreObra: '',
        FechaInicio: '',
        FechaCierre: '',
        NumTrabajadores: '',
        Monto: '',
        PatronalId: ''
    })
    const handleOpenModal = () => setIsOpen(true)
    const handleCloseModal = () => {
        setIsOpen(false)
        setEditMode(false)
        setIdEdited(null)
    }

    const CargarObras = async () =>{
        const data = await ObraService.getAll()
        setListaObras(data)
    }

    const CargarPatronales = async () => {
        const data = await ObraService.getPatronal()
        setPatronal(data)
    }
    useEffect(() => {
        CargarObras()
        CargarPatronales()
    },[])

    const handleChange = (e) =>{
        setObras({...obras, [e.target.name]: e.target.value})
    }

    const handleSubmit = async () =>{
        if(editMode)
        {
            await ObraService.update(idEdited, obras)
        }
        else
        {
            await ObraService.create(obras)
        }
        CargarObras()
        setIsOpen(false)
        setEditMode(false)
        setIdEdited(null)
        setObras({
           
            NombreObra: '',
            FechaInicio: '',
            FechaCierre: '',
            NumTrabajadores: '',
            Monto: '',
            PatronalId: ''
        })
    }

    const handleEdit = (obra) => {

        setObras({
            NombreObra: obra.nombreObra,
            FechaInicio: obra.fechaInicio?.split('T')[0],
            FechaCierre: obra.fechaCierre?.split('T')[0],
            NumTrabajadores: obra.numTrabajadores,
            Monto: obra.monto,
            PatronalId: obra.patronalId ?? '' 
        })
        setIsOpen(true)
        setEditMode(true)
        setIdEdited(obra.id)
    }
    const handleDelete = async (id) => {
        if(!confirm('¿Desea eliminar esta obra?'))
            return 
        await ObraService.delete(id)
        CargarObras()
    }


    return(
        <div className="min-h-screen px-6 py-7">
            <h1 className="text-center text-3xl font-bold py-6">Todas las obras</h1>


            {/* Boton para abrir el modal */}
            <div className="flex justify-end mt-4 mb-4">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition"
                    onClick={handleOpenModal}
                >
                    + Nueva Obra
                </button>
            </div>

            {/*Modal para Agregar o editar obras */}
            <ObrasForm
                isOpen={isOpen}
                onClose={handleCloseModal}
                title={editMode ? "Editar Obra": "Agregar Obra"}
            >
                <div className="space-y-6">
                    {/*Primera fila 2 columnas  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Obra
                            </label>
                            <input 
                            type="text"
                            name="NombreObra"
                            value={obras.NombreObra}
                            onChange={handleChange}
                            placeholder="Nombre asignado a la obra" 
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número Patronal
                            </label>
                            <select 
                                value={obras.PatronalId}
                                name="PatronalId"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccione el número patronal</option>
                                {patronal.map((n) => (
                                    <option key={n.id} value={n.id}>
                                        {n.numerosPatronal}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Inicio
                            </label>
                            <input 
                            type="date" 
                            name="FechaInicio"
                            onChange={handleChange}
                            value={obras.FechaInicio}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Cierre
                            </label>
                            <input 
                            type="date"
                            name="FechaCierre"
                            onChange={handleChange}
                            value={obras.FechaCierre} 
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Trabajadores
                        </label>
                        <input 
                        type="number"
                        name="NumTrabajadores"
                        value={obras.NumTrabajadores}
                        onChange={handleChange}
                        placeholder="Cantidad de trabajadores en la obra" 
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monto de la Obra
                        </label>
                        <input 
                        type="number"
                        name="Monto"
                        onChange={handleChange}
                        value={obras.Monto}
                        placeholder="Ingrese el monto de la obra" 
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Botón Guardar */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-2xl transition duration-200 shadow-md"
                        >
                            {editMode ? "Editar Obra" : "Guardar Obra"}
                        </button>
                    </div>
                </div>
            </ObrasForm>
            {/* Tabla de todas las obras */}
            <ObrasList obras={ListaObras} onEdit={handleEdit} onDelete={handleDelete}/>
        </div>
    )
}