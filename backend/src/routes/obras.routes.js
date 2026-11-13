import express from "express"
import { listarObras, obtener, crear, actualizar, eliminar } from "../controllers/obras.controller.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();
export default router;

router.get("/",verificarToken, listarObras)
router.post("/", verificarToken, crear)
router.put("/:id",verificarToken, actualizar)
router.delete("/:id", verificarToken, eliminar)