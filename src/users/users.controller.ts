import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { map, Observable } from 'rxjs';
import { User } from './user.interface';
import { UserResponse } from './dto/user-response.dto';
import { access } from 'fs';
import { LoginDto } from './dto/login-dto.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Observable<UserResponse[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<UserResponse> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(Number(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Post('login')
  login(@Body() loginCred:LoginDto):Observable<Object>{
    return this.usersService.login(loginCred).pipe(
      map((jwt:string)=>{
        return {access_token :jwt};
      })
    )
  }
}
