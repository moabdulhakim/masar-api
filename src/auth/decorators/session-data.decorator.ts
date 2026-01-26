import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type SessionDataType = {
    userAgent: string;
    ip: string;
}

export const SessionData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const userAgent = request.headers["user-agent"];


        let ip: string = request.ip;

        let xForwardedFor = request.headers["x-forwarded-for"];
        if(!ip && typeof xForwardedFor == "string"){
            ip = xForwardedFor.split(",")[0];
        }

        return { userAgent, ip };
    }
);