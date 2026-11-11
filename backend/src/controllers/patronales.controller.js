import pool from "../config/db.js";

export async function listar(req, res) {
    const [rows] = await pool.query(
        "SELECT Id AS id, numero_patronal AS numeroPatronal FROM numeros_patronales ORDER BY numero_patronal"
    );
    res.json(rows);
}