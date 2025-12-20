import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";
import { UserEntity, UserRole } from "../../domain/user.entity";

const JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

export interface JwtTokenPayload extends JwtPayload {
    id: string;
    email: string;
    role: UserRole;
}

/**
 * Servicio para generar y verificar tokens JWT
 */
export class JwtTokenService {
    /**
     * Genera un token JWT para un usuario
     */
    static generateToken(user: UserEntity): string {
        const payload: JwtTokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        return sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY as any,
        });
    }

    /**
     * Verifica y decodifica un token JWT
     */
    static verifyToken(token: string): JwtTokenPayload {
        return verify(token, JWT_SECRET) as JwtTokenPayload;
    }
}
