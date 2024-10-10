import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { UserResponse } from './dto/user-response.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from './dto/login-dto.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto): Observable<UserResponse> {
    return this.authService.hashPassword(createUserDto.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new CreateUserDto();
        newUser.name = createUserDto.name;
        newUser.username = createUserDto.username;
        newUser.email = createUserDto.email;
        newUser.password = passwordHash;
        return from(this.userRepository.save(newUser)).pipe(
          map(
            (savedUser: User): UserResponse => ({
              id: savedUser.id,
              name: savedUser.name,
              username: savedUser.username,
              email: savedUser.email,
            }),
          ),
        );
      }),
    );
  }

  findAll(): Observable<UserResponse[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  findOne(id: number): Observable<UserResponse> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map(
        (savedUser: User): UserResponse => ({
          id: savedUser.id,
          name: savedUser.name,
          username: savedUser.username,
          email: savedUser.email,
        }),
      ),
    );
  }

  updateOne(id: number, updateUserDto: UpdateUserDto): Observable<any> {
    delete updateUserDto.email;
    delete updateUserDto.password;

    return from(this.userRepository.update(id, updateUserDto));
  }

  remove(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOneBy({ email }));
  }

  validateUser(email: string, password: string): Observable<UserResponse> {
    return this.findByEmail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }
  login(loginCred: LoginDto): Observable<string> {
    return this.validateUser(loginCred.email,loginCred.password).pipe(
      switchMap((user:User)=>{
        if(user){
          return this.authService.generateJWT(user).pipe(map((jwt:string) => jwt));
        } else {
          return 'Wrong credantials';
        }
      })
    )
  }
}
