import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({username, password: hashedPassword});
    return this.usersRepository.save(user);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({where: {username}});
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) throw new NotFoundException('The user was not found');
    return user;
  }

  async updateUser(id: string, username?: string, password?: string): Promise<User> {
    const user = await this.getUserById(id);
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('The user was not found');
    }
  }
}
