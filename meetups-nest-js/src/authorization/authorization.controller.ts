import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { Request } from 'express';
import userScheme, { UserDto } from './dto/user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authService: AuthorizationService) {}

  @Post('login')
  async login(@Body() userScheme: UserDto): Promise<any> {
    return this.authService.signIn(userScheme.username, userScheme.password);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<void> {
    this.authService.logout(parseInt(req.user['sub']));
  }

  @Post('register')
  async register(@Body() userScheme: UserDto): Promise<any> {
    return this.authService.register(userScheme.username, userScheme.password);
  }
}
