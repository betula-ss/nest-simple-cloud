import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly as: AuthService
  ) {}

  @Post()
  @ApiOperation({summary: 'Create a user'})
  async createUser(@Body() body: {username: string; password: string}) {
    return this.usersService.createUser(body.username, body.password);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get a user by id'})
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Change user data by id'})
  async updateUser(@Param('id') id: string, @Body() body: {username?: string; password?: string}) {
    // return this.usersService.updateUser(id, body.username, body.password);
    const updatedUser = await this.usersService.updateUser(id, body.username, body.password);
    return this.as.generateToken({id: updatedUser.id, username: updatedUser.username});
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a user by id'})
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
