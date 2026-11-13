import express from "express"
import { listarProveedores, crearProveedores } from "../controllers/proveedores.controller.js"
import { verificarToken } from "../middleware/auth.js"

const router = express.Router()
export default router;

router.get("/", verificarToken, listarProveedores);
router.post("/", verificarToken, crearProveedores);