import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private us: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.us.getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, username: user.username };
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = {
      id: user.id,
      username: user.username
    };
    return {access_token: this.jwtService.sign(payload)};
  }

  generateToken(payload: any) {
    return {access_token: this.jwtService.sign(payload)};
  }
}
