import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from 'src/entities/user-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSession])
  ],
  providers: [SessionsService],
  controllers: [SessionsController]
})
export class SessionsModule {}
