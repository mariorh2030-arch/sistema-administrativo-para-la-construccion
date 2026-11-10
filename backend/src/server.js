
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API de gestión de obras funcionando correctamente"
    });
});

const PORT = process.env.PORT || 3000;

app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS tablas FROM information_schema.tables WHERE table_schema = ?", [process.env.DB_NAME]);
        res.json({ conectado: true, ...rows[0] })
        console.log("conexion a la base de datos establecida")
    } catch (error) {
        console.error(error);
        res.status(500).json({ conectado: false, message: error.message})
    }
}); 


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
