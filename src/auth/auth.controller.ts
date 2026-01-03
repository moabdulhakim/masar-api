import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Controller({
    path: "auth",
    version: "1"
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const payload = await this.authService.login(loginData);
    await this.authService.updateRefreshToken(payload.id, payload.refreshToken);
    return payload;
  }

  @Post("register")
  register(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }
}
