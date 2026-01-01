import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default (configService: ConfigService): JwtModuleOptions => ({
  global: true,
  secret: configService.get<string>("JWT_SECRET"),
  signOptions: {
    expiresIn: configService.get<string>("JWT_EXPIRATION_TIME") as any,
  },
});
