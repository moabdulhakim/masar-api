export interface AuthJWTPayload {
    sub: string,
    roles: UserRole[],
} 