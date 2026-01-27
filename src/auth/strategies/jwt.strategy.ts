import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJWTPayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY)
                private jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.secret as any,
        })
    }

    validate(payload: AuthJWTPayload) {
        return {...payload, id: payload.sub};
    }
}