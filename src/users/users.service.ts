import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { from, Observable } from 'rxjs';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Observable<UserResponse> {
    return from(this.userRepository.save(createUserDto));
  }

  findAll(): Observable<UserResponse[]> {
    return from(this.userRepository.find());
  }

  findOne(id: number): Observable<UserResponse> {
    return from(this.userRepository.findOneBy({ id }));
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    return from(this.userRepository.update(id, updateUserDto));
  }

  remove(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
}
