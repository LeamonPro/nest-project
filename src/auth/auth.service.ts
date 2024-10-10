import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Observable, of } from 'rxjs';
import { from } from 'rxjs';
import { User } from 'src/users/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password,12));
  }

  comparePasswords(newPassword :string ,passwordHash:string): Observable<any> {
    return of<any | boolean>(bcrypt.compare(newPassword,passwordHash));
  }
}
