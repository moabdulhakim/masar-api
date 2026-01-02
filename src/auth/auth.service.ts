import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async login(loginData: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {email: loginData.email},
      select: ['id', 'email', 'password']
    });

    if (!user) {
      throw new UnauthorizedException("Email or Password is invalid");
    }

    const passwordMatches = await argon2.verify(user.password, loginData.password);

    if (!passwordMatches) {
      throw new UnauthorizedException("Email or Password is invalid");
    }

    const payload: AuthJWTPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return { email: user.email, accessToken: token };
  }

  async register(userData: RegisterUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [
        {email: userData.email},
        {phone: userData.phone}
      ],
      select: ['id', 'email', 'password']
    });
    
    if (user) {
      if(user.email == userData.email){
        throw new ConflictException("User with this email already exists, you can login instead");
      }else{
        throw new ConflictException("User with this phone already exists, you can login instead");
      }
    }
    
    const hashedPassword = await argon2.hash(userData.password);
    userData.password = hashedPassword;
    
    const newUser = this.userRepository.create(userData);

    return await this.userRepository.save(newUser);
  }
}
