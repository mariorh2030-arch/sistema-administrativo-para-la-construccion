import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const [email, password, nombre, apellido, rol = "admin"] = process.argv.slice(2);

if (!email || !password || !nombre || !apellido) {
    console.log("Uso: node src/scripts/crear-usuario.js email password nombre apellido [rol]");
    process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

await pool.query(
    "INSERT INTO usuarios (email, passwordHash, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)",
    [email, hash, nombre, apellido, rol]
);

console.log("Usuario creado:", email);
await pool.end();