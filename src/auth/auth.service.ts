import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtHelperService } from 'src/Common/helper/jwtHelpers';
import { UserStatus } from '@prisma/client';
import { emailSender } from 'src/Common/utils/emailSender';

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

  async refreshTokenDB(token: any) {
    // console.log(token);

    let decodedData;
    try {
      decodedData = this.jwtHelperService.verifyToken(
        token,
        this.configService.get('jwt.refresh_token_secret'),
      );
    } catch (err) {
      throw new HttpException(
        err?.message || 'You are not authorized!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: decodedData.email,
        status: UserStatus.active,
      },
    });

    const accessToken = this.jwtHelperService.generateToken(
      {
        id: userData.id,
        email: userData.email,
        role: userData.role,
      },
      this.configService.get('jwt.jwt_secret'),
      this.configService.get('jwt.expires_in'),
    );

    return {
      accessToken,
    };
  }

  async changePasswordDB(user: any, payload: any) {
    const userData = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
        status: UserStatus.active,
      },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(
      payload.oldPassword,
      userData.password,
    );

    if (!isCorrectPassword) {
      throw new Error('Password incorrect!');
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await this.prisma.user.update({
      where: {
        email: userData.email,
      },
      data: {
        password: hashedPassword,
        lastPasswordChange: new Date(),
      },
    });

    return {
      message: 'Password changed successfully!',
    };
  }

  //todo nodemaler problem here
  async forgotPasswordDB(payload: { email: string }) {
    const userData = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.active,
      },
    });

    const resetPassToken = this.jwtHelperService.generateToken(
      { id: userData.id, email: userData.email, role: userData.role },
      this.configService.get('jwt.reset_pass_secret'),
      this.configService.get('jwt.reset_pass_token_expires_in'),
    );
    //console.log(resetPassToken)

    const resetPassLink =
      this.configService.get('reset_pass_link') +
      `?userId=${userData.id}&token=${resetPassToken}`;
    // `${process.env.FRONTEND_URL}/forget-password?id=${user.id}&token=${resetToken} `

    await emailSender(
      userData.email,
      `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>
  
        </div>
        `,
      this.configService,
    );
  }

  async resetPasswordDB(
    token: string,
    payload: { id: string; password: string },
  ) {
    await this.prisma.user.findUniqueOrThrow({
      where: {
        id: payload.id,
        status: UserStatus.active,
      },
    });

    const isValidToken = this.jwtHelperService.verifyToken(
      token,
      this.configService.get('jwt.reset_pass_secret'),
    );

    if (!isValidToken) {
      throw new ForbiddenException('Forbidden!');
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        password,
      },
    });
  }
}
