/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { IPaginationOptions } from 'src/Common/interface/pagination';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import { userSearchAbleFields } from './user.const';
import { Prisma } from '@prisma/client';

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
}
