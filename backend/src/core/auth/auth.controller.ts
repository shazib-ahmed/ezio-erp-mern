import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '@/common/decorators/public.decorator';
import { GetUser } from '@/common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('signup')
  signup(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  @Get('me')
  getProfile(@GetUser('id') userId: string) {
    return this.authService.getMe(Number(userId));
  }

  @Post('refresh')
  @Public()
  refresh(@Body('userId') userId: string, @Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(Number(userId), refreshToken);
  }

  @Post('logout')
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(Number(userId));
  }


}
