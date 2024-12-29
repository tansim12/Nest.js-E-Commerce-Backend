/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { IPaginationOptions } from 'src/Common/interface/pagination';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import {
  userSearchAbleFields,
  userWishListSearchAbleFields,
} from './user.const';
import { Prisma, UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllUsersDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: userSearchAbleFields.map((field) => ({
          [field]: {
            contains: queryObj.searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (Object.keys(filterData).length > 0) {
      andCondition.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: filterData[key as never],
          },
        })),
      });
    }

    const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

    const result = await this.prisma.user.findMany({
      where: whereConditions,
      select: {
        email: true,
        name: true,
        createdAt: true,
        id: true,
        status: true,
        isDelete: true,
        role: true,
        updatedAt: true,
        userProfile: true,
      },
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: 'desc',
            },
    });

    const total = await this.prisma.user.count({
      where: whereConditions,
    });
    const meta = {
      page,
      limit,
      total,
    };
    return {
      meta,
      result,
    };
  }

  async adminUpdateUserDB(userId: string, payload: any) {
    if (payload?.email || payload.password) {
      throw new HttpException(
        "You Can't change email or password",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const result = await this.prisma.$transaction(async (tx) => {
      const userInfo = await tx.user.update({
        where: {
          id: userId,
        },
        data: payload,
        select: {
          id: true,
          name: true,
          email: true,
          isDelete: true,
          role: true,
          status: true,
          updatedAt: true,
        },
      });
      await tx.userProfile.update({
        where: {
          email: userInfo.email,
        },
        data: {
          status: payload?.status,
        },
      });
      return userInfo;
    });

    return result;
  }

  async findMyProfileDB(tokenUser: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: tokenUser?.email,
        isDelete: false,
        status: UserStatus.active,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isDelete: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userProfile: true,
        shopFollow: {
          select: {
            shop: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    return user;
  }
  async updateMyProfileDB(tokenUser: any, body: any) {
    const { name, ...payload } = body;
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: tokenUser.email,
        isDelete: false,
        status: UserStatus.active,
      },
    });

    if (body.status || body.role) {
      throw new HttpException(
        "You can't change role and status",
        HttpStatus.BAD_REQUEST,
      );
    }

    if (name) {
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          name,
        },
      });
    }
    const userProfile = await this.prisma.userProfile.update({
      where: { email: user.email },
      data: payload,
    });

    return userProfile;
  }
  async getSingleUserDB(paramsId: string) {
    const result = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: paramsId,
        isDelete: false,
        status: UserStatus.active,
      },
      select: {
        email: true,
        id: true,
        role: true,
        name: true,
        isDelete: true,
        createdAt: true,
        lastPasswordChange: true,
        status: true,
        updatedAt: true,
        userProfile: true,
      },
    });
    return result;
  }

  async createWishlistDB(tokenUser: any, payload: any) {
    const result = await this.prisma.wishlist.create({
      data: {
        userId: tokenUser?.id,
        productId: payload?.productId,
      },
    });
    return result;
  }
  async findUserAllWishListDB(
    queryObj: any,
    options: IPaginationOptions,
    tokenUser: any,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: userWishListSearchAbleFields?.map((field) => ({
          [field]: {
            contains: queryObj.searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (Object.keys(filterData).length > 0) {
      andCondition.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: filterData[key as never],
          },
        })),
      });
    }

    const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

    const result = await this.prisma.wishlist.findMany({
      where: {
        ...(whereConditions as any),
        userId: tokenUser?.id,
      },
      select: {
        product: true,
      },
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: 'desc',
            },
    });

    const total = await this.prisma.wishlist.count({
      where: {
        ...(whereConditions as any),
        userId: tokenUser?.id,
      },
    });
    const meta = {
      page,
      limit,
      total,
    };
    return {
      meta,
      result,
    };
  }
}
