import { AuthJWTPayload } from "./auth-jwtPayload";

export interface AuthRefreshJWTPayload extends AuthJWTPayload {
    sid: string,
} 