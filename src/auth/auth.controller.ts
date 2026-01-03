import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth/refresh-jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const payload = await this.authService.login(loginData);
    return payload;
  }

  @Post('register')
  register(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@CurrentUser() user: {id: string, refreshToken: string}) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }
}
