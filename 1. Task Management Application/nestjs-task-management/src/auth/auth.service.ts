import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(UserRepository)
    // private userRepository: UserRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
