import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type SessionDataType = {
    userAgent: string;
    ip: string;
}

export const SessionData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        let userAgent = request.headers["user-agent"] || "unknown";


        let xForwardedFor = request.headers["x-forwarded-for"];
        let ip: string = request.ip || (typeof xForwardedFor === 'string'? xForwardedFor.split(',')[0] : "unknown");

        return { userAgent, ip };
    }
);