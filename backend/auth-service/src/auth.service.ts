import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser() {
    const existingUser = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (!existingUser) {
      const adminUser = this.userRepository.create({
        id: uuidv4(),
        username: 'admin',
        email: 'admin@distroviz.com',
        password: 'admin123',
        role: 'ADMIN',
      });
      await this.userRepository.save(adminUser);

      const regularUser = this.userRepository.create({
        id: uuidv4(),
        username: 'user',
        email: 'user@distroviz.com',
        password: 'user123',
        role: 'USER',
      });
      await this.userRepository.save(regularUser);

      console.log('Default users seeded');
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username, password } });
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } }) || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } }) || null;
  }
}