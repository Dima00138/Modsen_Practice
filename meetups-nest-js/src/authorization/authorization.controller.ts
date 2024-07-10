import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthorizationService, Tokens } from './authorization.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { User } from '@prisma/client';
import { ApiBody, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import signInUser, { SignInUserDto } from './dto/signIn-user.dto';

@ApiTags('authorization')
@Controller()
export class AuthorizationController {
  constructor(private readonly authService: AuthorizationService) {}

  @Post('login')
  @ApiBody({type: SignInUserDto})
  @ApiResponse({ status: 200, description: 'Login successful.', type: Tokens })
  async login(@Body() user: SignInUserDto, @Res({ passthrough: true }) response: Response): Promise<Tokens> {
    try {
      const validUser = await signInUser.validateAsync(user);
      const tokens = await this.authService.signIn(validUser.username, validUser.password);
      
      response.cookie('accessToken', tokens.accessToken, {
        sameSite: 'strict',
      });
  
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict'
      });
      return tokens;
    }
    catch(err) {
      throw new BadRequestException();
    }
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiSecurity('access-token')
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
    this.authService.logout(parseInt(req.user['sub']));
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
  }

  @Post('register')
  @ApiBody({type: SignInUserDto})
  @ApiResponse({ status: 201, description: 'Registration successful.', type: SignInUserDto })
  async register(@Body() user: SignInUserDto): Promise<User> {
    try {
      const validUser = await signInUser.validateAsync(user);
      return this.authService.register(validUser.username, validUser.password);
    }
    catch (err) 
    {
      throw new BadRequestException();
    }
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiSecurity('refresh-token')
  @ApiResponse({ status: 200, description: 'Tokens refreshed.', type: Tokens })
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) response: Response) : Promise<Tokens> {
    const tokens = await this.authService.refreshTokens(parseInt(req.user['sub']), req.cookies['refreshToken']);

    response.cookie('accessToken', tokens.accessToken, {
      sameSite: 'strict'
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict'
    });

    return tokens;
  }
}
