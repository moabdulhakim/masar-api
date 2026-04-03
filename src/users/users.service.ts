import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { ArrayContains, Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async deleteAllUsers(){
        return await this.userRepo.delete({
            roles: Not(ArrayContains([UserRole.ADMIN]))
        });
    }
}
