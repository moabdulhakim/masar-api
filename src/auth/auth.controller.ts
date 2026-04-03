import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth/refresh-jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { SessionData, SessionDataType } from './decorators/session-data.decorator';
import { Response } from 'express';
import { getCookieOptions } from './utils/cookie-options.util';
import { ApiResponseUtil } from 'src/common/utils/api-response.util';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto, @SessionData() sessionData: SessionDataType, @Res({passthrough: true}) response: Response) {
    const {user, accessToken, refreshToken} = await this.authService.login(loginData, sessionData);

    response.cookie('accessToken', accessToken, getCookieOptions('access'));
    response.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return ApiResponseUtil.success("Logged in successfully", user);
  }

  @Post('register')
  async register(@Body() registerData: RegisterUserDto, @SessionData() sessionData: SessionDataType, @Res({passthrough: true}) response: Response) {
    const {user, accessToken, refreshToken} = await this.authService.register(registerData, sessionData);

    response.cookie('accessToken', accessToken, getCookieOptions('access'));
    response.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return ApiResponseUtil.success("Registered successfully", user);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: {sid: string}, @Res({passthrough: true}) response: Response){
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    
    await this.authService.logout(user.sid);

    return ApiResponseUtil.success('Logged out successfully from this device');
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-tokens')
  async refreshTokens(@CurrentUser() user: {id: string, sid: string, refreshToken: string}, @SessionData() sessionData: SessionDataType, @Res({passthrough: true}) response: Response) {
    const {accessToken, refreshToken} = await this.authService.refreshTokens(user.id, user.sid, user.refreshToken, sessionData);

    response.cookie('accessToken', accessToken, getCookieOptions('access'));
    response.cookie('refreshToken', refreshToken, getCookieOptions('refresh'));

    return ApiResponseUtil.success("Tokens have been refreshed successfully!");
  }
}
