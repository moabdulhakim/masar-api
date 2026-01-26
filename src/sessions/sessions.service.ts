import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from 'src/entities/user-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(UserSession)
        private readonly sessionsRepository: Repository<UserSession>,
    ){}

    async getUserSessions(userId: string){
        return await this.sessionsRepository.find({
            where:{
                user: {id: userId}
            },
            select: ["createdAt", "location", "userAgent"]
        })
    }
}
