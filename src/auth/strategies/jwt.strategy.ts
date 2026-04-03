import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY)
                private jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJwtFromCookie,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: jwtConfiguration.secret as any,
        })
    }

    private static extractJwtFromCookie(req: Request): string | null {
        if(req.cookies && 'accessToken' in req.cookies && req.cookies.accessToken.length > 0){
            return req.cookies.accessToken;
        }
        return null;
    }

    validate(payload: AuthJWTPayload) {
        return {...payload, id: payload.sub};
    }
}