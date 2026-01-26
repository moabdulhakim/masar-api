import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';

@Controller({
    path: "sessions",
    version: "1",
})
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService){}

    @UseGuards(JwtAuthGuard)
    @Get("user")
    async getUserSessions(@CurrentUser() user: AuthJWTPayload) {
        return this.sessionsService.getUserSessions(user.sub);
    }
}
