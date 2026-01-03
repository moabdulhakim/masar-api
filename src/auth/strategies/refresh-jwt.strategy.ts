import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { Request } from "express";


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


    validate(req: Request, payload: AuthJWTPayload) {
        const refreshToken = req.get('Authorization')?.replace("Bearer", '').trim();

        return {id: payload.sub, refreshToken};
    }
}