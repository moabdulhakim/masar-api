import { Controller, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from 'src/users/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiResponseUtil } from 'src/common/utils/api-response.util';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async deleteAllUsers() {
    const result = await this.usersService.deleteAllUsers();
    return ApiResponseUtil.success("All users deleted successfully", result);
  }
}
