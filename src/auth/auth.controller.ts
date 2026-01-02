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
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Post("register")
  register(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }
}
