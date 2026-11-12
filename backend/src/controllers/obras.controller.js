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

const COLUMNAS = {
        nombreObra: "nombre_obra",
        fechaInicio: "fecha_inicio",
        fechaCierre: "fecha_cierre",
        numTrabajadores: "num_trabajadores",
        monto: "monto",
        patronalId: "patronal_id",
    };
    const FECHA = /^\d{4}-\d{2}-\d{2}$/;
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
function leerParcial(body = {}) {
    const campos = {};
    for (const clave of Object.keys(COLUMNAS)) {
        const pascal = clave[0].toUpperCase() + clave.slice(1);
        if (clave in body) campos[clave] = body[clave];
        else if (pascal in body) campos[clave] = body[pascal];
    }
    return campos;
}

function validarCampo(clave, v) {
    const vacio = v === "" || v === null || v === undefined;
    switch (clave) {
        case "nombreObra":
            return String(v ?? "").trim() ? null : "El nombre de la obra no puede estar vacío";
        case "fechaInicio":
            return FECHA.test(v) ? null : "La fecha de inicio no es válida";
        case "fechaCierre":
            return vacio || FECHA.test(v) ? null : "La fecha de cierre no es válida";
        case "numTrabajadores":
            return !vacio && Number.isInteger(Number(v)) && Number(v) >= 0
                ? null : "El número de trabajadores no es válido";
        case "monto":
            return !vacio && Number.isFinite(Number(v)) && Number(v) >= 0
                ? null : "El monto no es válido";
        case "patronalId":
            return !vacio && Number.isInteger(Number(v)) && Number(v) > 0
                ? null : "Selecciona un número patronal";
    }
}

function normalizar(clave, v) {
    switch (clave) {
        case "nombreObra": return String(v).trim();
        case "fechaCierre": return v || null; // "" o null = quitar la fecha
        case "numTrabajadores":
        case "monto":
        case "patronalId": return Number(v);
        default: return v;
    }
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
    const crudos = leerParcial(req.body);
    const claves = Object.keys(crudos);

    if (claves.length === 0)
        return res.status(400).json({ message: "No hay campos para actualizar" });

    for (const clave of claves) {
        const error = validarCampo(clave, crudos[clave]);
        if (error) return res.status(400).json({ message: error });
    }

    const campos = {};
    for (const clave of claves) campos[clave] = normalizar(clave, crudos[clave]);

    // Si cambian fechas, comparar contra lo que ya está guardado
    if ("fechaInicio" in campos || "fechaCierre" in campos) {
        const [actual] = await pool.query(
            "SELECT fecha_inicio AS fechaInicio, fecha_cierre AS fechaCierre FROM obras WHERE Id = ?",
            [req.params.id]
        );
        if (actual.length === 0)
            return res.status(404).json({ message: "Obra no encontrada" });

        const inicio = campos.fechaInicio ?? actual[0].fechaInicio;
        const cierre = "fechaCierre" in campos ? campos.fechaCierre : actual[0].fechaCierre;
        if (cierre && cierre < inicio)
            return res.status(400).json({ message: "La fecha de cierre no puede ser anterior a la de inicio" });
    }

    // Los nombres de columna salen de COLUMNAS (no del usuario), los valores van con "?"
    const set = claves.map((c) => `${COLUMNAS[c]} = ?`).join(", ");
    const valores = claves.map((c) => campos[c]);

    try {
        const [result] = await pool.query(
            `UPDATE obras SET ${set} WHERE Id = ?`,
            [...valores, req.params.id]
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