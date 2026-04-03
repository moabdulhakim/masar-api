import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { Request } from "express";
import { AuthRefreshJWTPayload } from "../types/auth-refresh-jwt-payload";


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RefreshJwtStrategy.extractJwtFromCookie,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: refreshJwtConfiguration.secret as any,
            passReqToCallback: true,
        })
    }

    private static extractJwtFromCookie(req: Request): string | null {
        if(req.cookies && 'refreshToken' in req.cookies && req.cookies.refreshToken.length > 0){
            return req.cookies.refreshToken;
        }
        return null;
    }

    validate(req: Request, payload: AuthRefreshJWTPayload) {
        const refreshToken = RefreshJwtStrategy.extractJwtFromCookie(req) || req.get('Authorization')?.replace("Bearer ", '').trim();

        return {...payload, id: payload.sub, refreshToken};
    }
}