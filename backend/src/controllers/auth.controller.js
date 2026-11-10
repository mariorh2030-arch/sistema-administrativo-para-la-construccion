import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function login(req, res) {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({ message: "El correo y la contraseña son requeridos" });
    }

    const [rows] = await pool.query(
        "SELECT Id, email, passwordHash, nombre, apellido, rol FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1",
        [email]
    );
    const usuario = rows[0];

    // Mismo mensaje si no existe el usuario o la contraseña está mal
    const valido = usuario && (await bcrypt.compare(password, usuario.passwordHash));
    if (!valido) {
        return res.status(401).json({ message: "Email o contraseña incorrectos" });
    }

    const token = jwt.sign(
        { id: usuario.Id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
        success: true,
        token,
        user: {
            id: usuario.Id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol,
        },
    });
}