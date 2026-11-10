import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
    const [tipo, token] = (req.headers.authorization || "").split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token requerido" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
}