import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type SessionDataType = {
    userAgent: string;
    ip: string;
}

export const SessionData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const userAgent = request.headers["user-agent"];
        const ip = request.headers["x-forwarded-for"] || request.ip;

        return { userAgent, ip };
    }
);