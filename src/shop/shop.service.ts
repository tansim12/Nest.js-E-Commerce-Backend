/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import { IPaginationOptions } from 'src/Common/interface/pagination';
import { PrismaService } from 'src/prisma.service';
import { shopSearchAbleFields } from './shop.const';
import { Prisma, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async crateShopDB(tokenUser: any, payload: any) {
    await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser.id,
        isDelete: false,
        OR: [
          {
            role: UserRole.admin,
          },
          {
            role: UserRole.vendor,
          },
        ],
      },
    });
    await this.prisma.user.findUniqueOrThrow({
      where: {
        id: payload.vendorId,
        isDelete: false,
        OR: [
          {
            role: UserRole.vendor,
          },
        ],
      },
    });

    const result = await this.prisma.shop.create({
      data: payload,
    });
    return result;
  }

  async findSingleShopPublicDB(
    shopId: string,
    queryObj: any,
    options: IPaginationOptions,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const result = await this.prisma.shop.findUniqueOrThrow({
      where: {
        id: shopId,
        isDelete: false,
      },
      include: {
        shopReview: true,
        vendor: {
          select: {
            name: true,
            email: true,
            userProfile: {
              select: {
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            shopFollow: true,
            product: true,
          },
        },
        product: {
          skip,
          take: limit,
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    const total = await this.prisma.shop.count({
      where: {
        id: shopId,
        isDelete: false,
      },
    });
    const meta = {
      page,
      limit,
      total: result?._count?.product,
    };
    return {
      meta,
      result,
    };
  }

  // public all shop get
  async findAllShopPublicDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;
    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopSearchAbleFields.map((field) => ({
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

    const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

    const result = await this.prisma.shop.findMany({
      where: {
        ...(whereConditions as any),
        isDelete: false,
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

    const total = await this.prisma.shop.count({
      where: whereConditions as any,
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

  // following and review section
  async shopFollowingDB(tokenUser: any, payload: any) {
    const userInfo = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser.id,
        isDelete: false,
        status: UserStatus.active,
      },
    });

    if (payload?.isDelete === false) {
      const result = await this.prisma.shopFollow.upsert({
        where: {
          userId_shopId: {
            shopId: payload?.shopId,
            userId: userInfo?.id,
          },
        },
        update: {
          ...payload,
          userId: userInfo?.id,
        },
        create: {
          ...payload,
          userId: userInfo?.id,
        },
      });
      return result;
    }
    if (payload?.isDelete === true) {
      const result = await this.prisma.shopFollow.delete({
        where: {
          userId_shopId: {
            shopId: payload?.shopId,
            userId: userInfo?.id,
          },
        },
      });
      return result;
    }
  }
  async shopReviewDB(tokenUser: any, payload: any) {
    const userInfo = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser.id,
        isDelete: false,
        status: UserStatus.active,
      },
    });

    if (payload?.isDelete === false) {
      const result = await this.prisma.shopReview.upsert({
        where: {
          userId_shopId: {
            shopId: payload?.shopId,
            userId: userInfo?.id,
          },
        },
        update: {
          ...payload,
          userId: userInfo?.id,
        },
        create: {
          ...payload,
          userId: userInfo?.id,
        },
      });
      return result;
    }
    if (payload?.isDelete === true) {
      const result = await this.prisma.shopReview.delete({
        where: {
          userId_shopId: {
            shopId: payload?.shopId,
            userId: userInfo?.id,
          },
        },
      });
      return result;
    }
  }

  async vendorFindHisShopDB(tokenUser: any) {
    const result = await this.prisma.shop.findUnique({
      where: {
        vendorId: tokenUser?.id,
      },
    });
    return result;
  }

  async updateShopInfoDB(tokenUser: any, shopId: string, payload: any) {
    const isVendor = await this.prisma.user.findUnique({
      where: {
        id: tokenUser.id,
        role: UserRole.vendor,
      },
    });

    if (isVendor) {
      await this.prisma.shop.findUniqueOrThrow({
        where: {
          id: shopId,
          vendorId: isVendor?.id,
        },
      });
    }
    const { vendorId, id, ...newPayload } = payload;
    const result = await this.prisma.shop.update({
      where: {
        id: shopId,
      },
      data: newPayload,
    });
    return result;
  }

  // public all shop get
  async adminFindAllShopDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;
    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopSearchAbleFields.map((field) => ({
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

    const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

    const result = await this.prisma.shop.findMany({
      where: {
        ...(whereConditions as any),
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

    const total = await this.prisma.shop.count({
      where: whereConditions as any,
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

  async findSingleUserFollowDB(tokenUser: any, shopId: string) {
    const result = await this.prisma.shopFollow.findFirst({
      where: {
        userId: tokenUser?.id,
        shopId,
      },
    });
    if (!result) {
      return {
        status: 201,
        message: 'No Table create',
      };
    }
    return result;
  }

  async isShopExistDb(tokenUser: any) {
    const findShop = await this.prisma.user?.findUnique({
      where: {
        id: tokenUser?.id,
        isDelete: false,
        role: UserRole.vendor,
        shop: {
          isDelete: false,
          isBlocked: false,
        },
      },
      select: {
        shop: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!findShop?.shop?.id) {
      return {
        status: 400,
        message: 'Please shop Create First',
      };
    }

    return {
      status: 200,
      message: 'Shop Exist',
    };
  }
}
