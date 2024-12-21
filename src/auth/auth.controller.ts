import {
  Controller,
  Post,
  Req,
  Res,
  Next,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { Roles } from 'src/Common/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.authService.signupDB(req?.body);
      return res.send(successResponse(result, HttpStatus.OK, 'Signup done'));
    } catch (error) {
      next(error);
    }
  }
  @Post('login')
  async loginUser(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.authService.loginUserDB(req?.body);

      const { refreshToken } = result;

      res.cookie('refreshToken', refreshToken, {
        secure: this.configService.get('env') === 'production',
        httpOnly: true,
      });
      res.send(
        successResponse(
          {
            accessToken: result.accessToken,
            refreshToken,
          },
          HttpStatus.OK,
          'Signup successfully!',
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { refreshToken } = req.cookies;
      const result = await this.authService.refreshTokenDB(refreshToken);
      return res.send(
        successResponse(result, HttpStatus.OK, 'refresh token send'),
      );
    } catch (error) {
      next(error);
    }
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @Roles(UserRole.user, UserRole.admin, UserRole.vendor)
  async changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.authService.changePasswordDB(
        req?.user,
        req?.body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'Password change'),
      );
    } catch (error) {
      next(error);
    }
  }

  @Post('forget-password')
  @UseGuards(AuthGuard)
  @Roles(UserRole.user, UserRole.admin, UserRole.vendor)
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.authService.forgotPasswordDB(req?.body);
      return res.send(
        successResponse(result, HttpStatus.OK, 'email send message'),
      );
    } catch (error) {
      next(error);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const token = req.headers.authorization || '';
      const result = await this.authService.resetPasswordDB(token, req?.body);
      return res.send(
        successResponse(result, HttpStatus.OK, 'Password change done'),
      );
    } catch (error) {
      next(error);
    }
  }
}
