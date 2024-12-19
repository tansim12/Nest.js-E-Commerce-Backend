import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtHelperService } from 'src/Common/helper/jwtHelpers';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtHelperService: JwtHelperService,
  ) {}
  async signupDB(body: any) {
    const hashPass = await bcrypt.hash(body?.password, 12);
    const userData = {
      name: body?.name,
      email: body?.email,
      password: hashPass,
    };

    const result = await this.prisma.$transaction(async (tnx) => {
      const userInfo = await tnx.user.create({
        data: userData,
      });

      await tnx.userProfile.create({
        data: {
          email: userInfo.email,
          userId: userInfo.id,
        },
      });

      if (!userInfo) {
        throw new HttpException(
          'Something went wrong !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessToken = this.jwtHelperService.generateToken(
        {
          id: userInfo.id,
          email: userInfo?.email,
          role: userInfo?.role,
        },
        this.configService.get('jwt.jwt_secret'),
        this.configService.get('jwt.expires_in'),
      );

      const refreshToken = this.jwtHelperService.generateToken(
        { id: userInfo.id, email: userInfo?.email, role: userInfo?.role },
        this.configService.get('jwt.refresh_token_secret'),
        this.configService.get('jwt.refresh_token_expires_in'),
      );
      return {
        accessToken,
        refreshToken,
      };
    });

    return result;
  }

  async loginUserDB(payload: any) {
    const userData = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.active,
      },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
      payload.password,
      userData.password,
    );

    if (!isCorrectPassword) {
      throw new HttpException('Password incorrect!', HttpStatus.NOT_ACCEPTABLE);
    }
    const accessToken = this.jwtHelperService.generateToken(
      {
        id: userData.id,
        email: userData?.email,
        role: userData?.role,
      },
      this.configService.get('jwt.jwt_secret'),
      this.configService.get('jwt.expires_in'),
    );

    const refreshToken = this.jwtHelperService.generateToken(
      { id: userData.id, email: userData?.email, role: userData?.role },
      this.configService.get('jwt.refresh_token_secret'),
      this.configService.get('jwt.refresh_token_expires_in'),
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
