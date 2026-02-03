import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { ApiResponseUtil } from 'src/common/utils/api-response.util';

@Controller({
    path: "sessions",
    version: "1",
})
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService){}

    @UseGuards(JwtAuthGuard)
    @Get("user")
    async getUserSessions(@CurrentUser() user: AuthJWTPayload) {
        const sessions = await this.sessionsService.getUserSessions(user.sub);
        return ApiResponseUtil.success("User sessions fetched successfully", sessions);
    }
}
