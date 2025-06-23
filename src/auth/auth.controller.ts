import { Body, Controller, Post, ConflictException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hash = await this.userService.hashPassword(registerDto.password);
    const userToCreate = new CreateUserDto();
    userToCreate.userEmail = registerDto.email;
    userToCreate.userPassword = hash;
    userToCreate.userFirstName = registerDto.firstName;
    userToCreate.userLastName = registerDto.lastName;
    if (registerDto.role) {
      userToCreate.userRole = registerDto.role;
    }

    const newUser = await this.userService.create(userToCreate);
    return { message: 'Registered', id: newUser.userId };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }
}
