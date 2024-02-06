import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() body: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('auth', 'some random string');
    return this.authService.signIn(body.email, body.password, response);
  }

  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
