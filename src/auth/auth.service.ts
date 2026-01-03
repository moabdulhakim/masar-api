import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import * as argon2 from 'argon2';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async generateTokens(userId){
    const payload: AuthJWTPayload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfig,
    );

    return {accessToken, refreshToken}
  }

  async updateRefreshToken(userId, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    const {affected} = await this.userRepository.update({id: userId}, { hashedRefreshToken });

    if(!affected) throw new InternalServerErrorException('Something Went Wrong! Please Try Again');

    return hashedRefreshToken;
  }

  async refreshTokens(userId, hashedRefreshToken) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['hashedRefreshToken', 'id'],
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Security Alert!'); //TODO Send an Alert to the Admin!!
    }

    const tokenMatches = await argon2.verify(user.hashedRefreshToken, hashedRefreshToken);

    if (!tokenMatches) {
      await this.userRepository.update({id: user.id}, {hashedRefreshToken: null});
      throw new UnauthorizedException('Security Breach Detected! All sessions invalidated.'); //TODO Send an Alert to the Admin and the User with the Hacker's IP Address!!
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await this.generateTokens(user.id);

    await this.updateRefreshToken(user.id, newRefreshToken);

    return { id: user.id, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async login(loginData: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Email or Password is invalid');
    }

    const passwordMatches = await argon2.verify(
      user.password,
      loginData.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or Password is invalid');
    }

    const {accessToken, refreshToken} = await this.generateTokens(user.id);

    await this.updateRefreshToken(user.id, refreshToken);

    return { id: user.id, accessToken, refreshToken };
  }

  async register(userData: RegisterUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: userData.email }, { phone: userData.phone }],
      select: ['id', 'email', 'password'],
    });

    if (user) {
      if (user.email == userData.email) {
        throw new ConflictException(
          'User with this email already exists, you can login instead',
        );
      } else {
        throw new ConflictException(
          'User with this phone already exists, you can login instead',
        );
      }
    }

    //TODO Send a verification Email or SMS

    const hashedPassword = await argon2.hash(userData.password);
    userData.password = hashedPassword;

    const newUser = this.userRepository.create(userData);
    
    const savedUser = await this.userRepository.save(newUser)
    
    const {accessToken, refreshToken} = await this.generateTokens(savedUser.id);
    await this.updateRefreshToken(savedUser.id, refreshToken);

    return {...savedUser, accessToken, refreshToken};
  }
}
