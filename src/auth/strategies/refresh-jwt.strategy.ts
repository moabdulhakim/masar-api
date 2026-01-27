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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshJwtConfiguration.secret as any,
            passReqToCallback: true,
        })
    }


    validate(req: Request, payload: AuthRefreshJWTPayload) {
        const refreshToken = req.get('Authorization')?.replace("Bearer", '').trim();

        return {...payload, id: payload.sub, refreshToken};
    }
}