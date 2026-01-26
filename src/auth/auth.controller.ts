import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth/refresh-jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { SessionData, SessionDataType } from './decorators/session-data.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto, @SessionData() sessionData: SessionDataType) {
    const payload = await this.authService.login(loginData, sessionData);
    return payload;
  }

  @Post('register')
  register(@Body() registerData: RegisterUserDto, @SessionData() sessionData: SessionDataType) {
    return this.authService.register(registerData, sessionData);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: {sid: string}){
    return this.authService.logout(user.sid);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(@CurrentUser() user: {id: string, sid: string, refreshToken: string}, @SessionData() sessionData: SessionDataType) {
    return this.authService.refreshTokens(user.id, user.sid, user.refreshToken, sessionData);
  }
}
