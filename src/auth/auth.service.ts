import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from 'src/drivers/driver.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>
  ) {}

  async login(loginData: LoginDto) {
    const user = await this.driverRepository.findOneBy({email: loginData.email});

    if(!user){
        throw new BadRequestException("Email or Password is invalid");
    }

    // Password Validation
    if(loginData.password !== user.password){
        throw new BadRequestException("Email or Password is invalid");
    }

    const payload: AuthJWTPayload = {
      sub: user.id,
      email: loginData.email,
    };

    const token = this.jwtService.sign(payload);

    return { email: user.email, token };
  }
}
