import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJWTPayload } from 'src/auth/types/auth-jwtPayload';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import * as argon2 from 'argon2';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserSession } from 'src/entities/user-session.entity';
import { AuthRefreshJWTPayload } from './types/auth-refresh-jwt-payload';
import { SessionDataType } from './decorators/session-data.decorator';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,

    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async generateTokens(userId, sid) {
    const payload: AuthJWTPayload = {
      sub: userId,
    };

    const refreshTokenPayload: AuthRefreshJWTPayload = {
      sub: userId,
      sid: sid,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      this.refreshTokenConfig,
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(sid: string, refreshToken: string) {
    const refreshTokenHash = await argon2.hash(refreshToken);

    const { affected } = await this.userSessionRepository.update(
      { id: sid },
      { refreshTokenHash },
    );

    if (!affected)
      throw new InternalServerErrorException(
        'Failed to update refresh token for user.',
      );

    return refreshTokenHash;
  }

  async refreshTokens(
    userId: string,
    sid: string,
    refreshToken: string,
    sessionData: SessionDataType,
  ) {
    const userSession = await this.userSessionRepository.findOne({
      where: { id: sid, user: { id: userId } },
      select: ['refreshTokenHash', 'id', 'userAgent'],
    });

    if (!userSession || !userSession.refreshTokenHash) {
      throw new UnauthorizedException('Security Alert!'); //TODO Send an Alert to the Admin!!
    }

    if (userSession.userAgent !== sessionData.userAgent) {
      await this.userSessionRepository.delete({ id: sid });
      throw new UnauthorizedException('Security Alert!');
    }

    const tokenMatches = await argon2.verify(
      userSession.refreshTokenHash,
      refreshToken,
    );

    if (!tokenMatches) {
      await this.userSessionRepository.delete({ user: { id: userId } });
      throw new UnauthorizedException(
        'Security Breach Detected! All sessions invalidated.',
      ); //TODO Send an Alert to the Admin and the User with the Hacker's IP Address!!
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(userId, sid);

    await this.updateRefreshToken(sid, newRefreshToken);

    return {
      sid: sid,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async login(loginData: LoginDto, sessionData: SessionDataType) {
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

    const sid = uuidv4();

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      sid,
    );
    const refreshTokenHash = await argon2.hash(refreshToken);

    const location = await this.getIpLocation(sessionData.ip);

    await this.userSessionRepository.save({
      id: sid,
      user: user,
      location: location,
      userAgent: sessionData.userAgent,
      ipAddress: sessionData.ip,
      refreshTokenHash,
    });

    return { id: user.id, accessToken, refreshToken };
  }

  async register(userData: RegisterUserDto, sessionData: SessionDataType) {
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

    const newUser = this.userRepository.create({...userData, password: hashedPassword});

    const savedUser = await this.userRepository.save(newUser);

    return await this.login({email: savedUser.email, password: userData.password}, sessionData);
  }

  async logout(sid: string){
    const result = await this.userSessionRepository.delete({id: sid});

    if(result.affected === 0) {
      throw new NotFoundException("Session does not exist");
    }

    return {message: "Logged out successfully from this device"};
  }

  async getIpLocation(ip: string) {
    if (ip === '127.0.0.1' || ip === '::1') return 'Local Development';
    
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const {country, regionName, city} = await response.json();
        return `${country}, ${regionName}, ${city}`;
    } catch (error) {
        return 'Unknown Location';
    }
}
}

