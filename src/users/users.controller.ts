import { Controller, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller({
    path: "users",
    version: "1"
})
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete()
    async deleteAllUsers(){
        return this.usersService.deleteAllUsers();
    }
}
