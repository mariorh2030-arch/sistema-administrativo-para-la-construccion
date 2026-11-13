import pool from "../config/db.js";

const SELECT_PROVEEDORES = `
    SELECT  p.Id AS id,
            p.nombre_p AS nombreP,
            p.rfc
    FROM proveedores p`;

    // Acepta nombreObra o NombreObra (como lo manda tu pantalla hoy)
function leerCampos(body = {}) {
    const get = (k) => body[k] ?? body[k[0].toUpperCase() + k.slice(1)];
    return {
        nombrep: String(get("nombreP") ?? "").trim(),
        rfc: String(get("rfc") ?? "").trim()
    };
}

function validar(p){
    if(!p.nombrep) return "El nombre del proveedor es requerido";
    if(!p.rfc) return "El rfc es necesario"
}


export async function listarProveedores(req, res){
    const [rows] = await pool.query(`${SELECT_PROVEEDORES} ORDER BY p.Id DESC`);
    res.json(rows);
}

export async function crearProveedores(req, res){
    const proveedor = leerCampos(req.body)
    const error = validar(proveedor)

    if(error) return res.status(400).json({messege: error});

    try {
        const [result] = await pool.query(`
            INSERT INTO proveedores (nombre_p, rfc) VALUES( ?, ?)
            `,[proveedor.nombrep, proveedor.rfc]
    );
    const [rows] = await pool.query(`${SELECT_PROVEEDORES} WHERE p.Id = ?`, [result.insertId])
    res.status(201).json(rows[0])
    } catch (error) {
        if (error.code === "ER_NO_REFERENCED_ROW_2")
            return res.status(400).json({ message: "No se pudo insertar el proveedor" });
        throw error;
    }
}