import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
// import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

// import { Role } from 'src/common/enums/user/role.enum';
// import { Roles } from 'src/modules/auth/roles/roles.decorator';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }


}
