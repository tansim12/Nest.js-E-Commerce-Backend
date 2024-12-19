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
      return userInfo;
    });

    if (!result) {
      throw new HttpException('Something went wrong !', HttpStatus.BAD_REQUEST);
    }
    const accessToken = this.jwtHelperService.generateToken(
      {
        id: result.id,
        email: result?.email,
        role: result?.role,
      },
      '30d',
    );
    console.log(accessToken);

    const refreshToken = this.jwtHelperService.generateToken(
      { id: result.id, email: result?.email, role: result?.role },
      '30d',
    );
    return {
      accessToken,
      refreshToken,
    };
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
      { id: userData.id, email: userData.email, role: userData.role },
      '30d',
    );

    const refreshToken = this.jwtHelperService.generateToken(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      '30d',
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
