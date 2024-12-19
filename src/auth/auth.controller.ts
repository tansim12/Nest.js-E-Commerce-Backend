import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Next,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import { ConfigService } from '@nestjs/config';

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

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
