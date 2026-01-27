import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { ArrayContains, Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    async deleteAllUsers(){
        try{
            return await this.userRepo.delete({
                roles: Not(ArrayContains([UserRole.ADMIN]))
            });
        }catch(err){
            throw err;
        }
    }
}
