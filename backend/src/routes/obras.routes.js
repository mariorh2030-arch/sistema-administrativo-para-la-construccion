import pool from "../config/db.js";
import express from "express"
import { listarObras, obtener, crear } from "../controllers/obras.controller.js";
import { verificarToken } from "../middleware/auth.js";

export async function listar(req, res) {
    const [rows] = await pool.query(
        "SELECT Id AS id, numero_patronal AS numeroPatronal FROM numeros_patronales ORDER BY numero_patronal"
    );
    res.json(rows);
}
const router = express.Router();
export default router;

router.get("/",verificarToken, listarObras)
router.post("/", verificarToken, crear)