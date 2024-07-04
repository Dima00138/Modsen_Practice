import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { Request, Response } from 'express';
import { UserDto } from './dto/user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller()
export class AuthorizationController {
  constructor(private readonly authService: AuthorizationService) {}

  @Post('login')
  async login(@Body() userScheme: UserDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    const tokens = await this.authService.signIn(userScheme.username, userScheme.password);

    response.cookie('accessToken', tokens.accessToken, {
      sameSite: 'strict'
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
    });
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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) response: Response){
    const tokens = await this.authService.refreshTokens(parseInt(req.user['sub']), req.cookies['refreshToken']);

    response.cookie('accessToken', tokens.accessToken, {
      sameSite: 'strict'
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
    });
  }
}
