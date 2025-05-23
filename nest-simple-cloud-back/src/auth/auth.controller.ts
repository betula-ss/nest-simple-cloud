import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly as: AuthService) {}

  @Post('login')
  async login(@Body() body: {username: string; password: string}) {
    return this.as.login(body.username, body.password);
  }
}
