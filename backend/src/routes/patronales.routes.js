import { Router } from "express";
import { listar } from "../controllers/patronales.controller.js";

const router = Router();
router.get("/", listar);

export default router;