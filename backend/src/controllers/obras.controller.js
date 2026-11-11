import pool from "../config/db.js";

const SELECT_OBRAS = `
    SELECT o.Id AS id,
           o.nombre_obra AS nombreObra,
           o.fecha_inicio AS fechaInicio,
           o.fecha_cierre AS fechaCierre,
           o.num_trabajadores AS numTrabajadores,
           o.monto,
           o.patronal_id AS patronalId,
           p.numero_patronal AS numeroPatronal
    FROM obras o
    JOIN numeros_patronales p ON p.Id = o.patronal_id`;

// Acepta nombreObra o NombreObra (como lo manda tu pantalla hoy)
function leerCampos(body = {}) {
    const get = (k) => body[k] ?? body[k[0].toUpperCase() + k.slice(1)];
    return {
        nombreObra: String(get("nombreObra") ?? "").trim(),
        fechaInicio: get("fechaInicio") || null,
        fechaCierre: get("fechaCierre") || null,
        numTrabajadores: Number(get("numTrabajadores")),
        monto: Number(get("monto")),
        patronalId: Number(get("patronalId")),
    };
}

function validar(o) {
    if (!o.nombreObra) return "El nombre de la obra es requerido";
    if (!o.fechaInicio) return "La fecha de inicio es requerida";
    if (!Number.isInteger(o.numTrabajadores) || o.numTrabajadores < 0)
        return "El número de trabajadores no es válido";
    if (!Number.isFinite(o.monto) || o.monto < 0) return "El monto no es válido";
    if (!Number.isInteger(o.patronalId) || o.patronalId <= 0)
        return "Selecciona un número patronal";
    if (o.fechaCierre && o.fechaCierre < o.fechaInicio)
        return "La fecha de cierre no puede ser anterior a la de inicio";
    return null;
}

export async function listarObras(req, res) {
    const [rows] = await pool.query(`${SELECT_OBRAS} ORDER BY o.Id DESC`);
    res.json(rows);
}

export async function obtener(req, res) {
    const [rows] = await pool.query(`${SELECT_OBRAS} WHERE o.Id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Obra no encontrada" });
    res.json(rows[0]);
}

export async function crear(req, res) {
    const obra = leerCampos(req.body);
    const error = validar(obra);
    if (error) return res.status(400).json({ message: error });

    try {
        const [result] = await pool.query(
            `INSERT INTO obras (nombre_obra, fecha_inicio, fecha_cierre, num_trabajadores, monto, patronal_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [obra.nombreObra, obra.fechaInicio, obra.fechaCierre, obra.numTrabajadores, obra.monto, obra.patronalId]
        );
        const [rows] = await pool.query(`${SELECT_OBRAS} WHERE o.Id = ?`, [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2")
            return res.status(400).json({ message: "El número patronal no existe" });
        throw err;
    }
}

export async function actualizar(req, res) {
    const obra = leerCampos(req.body);
    const error = validar(obra);
    if (error) return res.status(400).json({ message: error });

    try {
        const [result] = await pool.query(
            `UPDATE obras
             SET nombre_obra = ?, fecha_inicio = ?, fecha_cierre = ?, num_trabajadores = ?, monto = ?, patronal_id = ?
             WHERE Id = ?`,
            [obra.nombreObra, obra.fechaInicio, obra.fechaCierre, obra.numTrabajadores, obra.monto, obra.patronalId, req.params.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Obra no encontrada" });
        res.status(204).end();
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2")
            return res.status(400).json({ message: "El número patronal no existe" });
        throw err;
    }
}

export async function eliminar(req, res) {
    try {
        const [result] = await pool.query("DELETE FROM obras WHERE Id = ?", [req.params.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Obra no encontrada" });
        res.status(204).end();
    } catch (err) {
        if (err.code === "ER_ROW_IS_REFERENCED_2")
            return res.status(409).json({ message: "No se puede eliminar: la obra tiene registros asociados" });
        throw err;
    }
}