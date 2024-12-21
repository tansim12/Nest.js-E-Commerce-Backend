/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCAndSubCDto } from './dto/create-c-and-sub-c.dto';
import { UpdateCAndSubCDto } from './dto/update-c-and-sub-c.dto';
import { PrismaService } from 'src/prisma.service';
import { TCategory } from './c-and-sub-c.interface';
import { formatCategoryName } from 'src/Common/utils/formatCategoryName';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import { IPaginationOptions } from 'src/Common/interface/pagination';
import { categorySearchAbleFields } from './c-and-sub-c.const';
import { Prisma } from '@prisma/client';

@Injectable()
export class CAndSubCService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategoryDB(tokenUser: any, payload: TCategory) {
    const { categoryName, ...newPayload } = payload;
    const categoryNameFormate = formatCategoryName(categoryName);
    const isExistCategory = await this.prisma.category.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });
    if (isExistCategory) {
      throw new HttpException(
        'This Category already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isExistSubCategory = await this.prisma.subCategory.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });
    if (isExistSubCategory) {
      throw new HttpException(
        'This SubCategory already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.prisma.category.create({
      data: {
        ...newPayload,
        categoryName: categoryNameFormate,
        adminId: tokenUser?.id,
      },
    });
    return result;
  }
  updateCategoryDB = async (categoryId: any, payload: TCategory) => {
    const { categoryName, ...newPayload } = payload;

    const categoryNameFormate = formatCategoryName(categoryName);
    const isExistCategory = await this.prisma.category.findFirst({
      where: {
        categoryName: categoryNameFormate,
        NOT: {
          id: categoryId,
        },
      },
    });
    if (isExistCategory) {
      throw new HttpException(
        'This Category already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isExistSubCategory = await this.prisma.subCategory.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });
    if (isExistSubCategory) {
      throw new HttpException(
        'This SubCategory already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...newPayload,
        categoryName: categoryNameFormate,
      },
    });
    return result;
  };

  async createSubCategoryDB(tokenUser: any, payload: TCategory) {
    const { categoryName } = payload;
    const categoryNameFormate = formatCategoryName(categoryName);

    const isExistCategory = await this.prisma.category.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });

    if (isExistCategory) {
      throw new HttpException(
        'This Category already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isExistSubCategory = await this.prisma.subCategory.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });
    if (isExistSubCategory) {
      throw new HttpException(
        'This SubCategory already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const isDeleteCategory = await this.prisma.category.findUnique({
      where: {
        id: payload.categoryId,
        isDelete: true,
      },
    });
    if (isDeleteCategory) {
      throw new HttpException(
        'This C  ategory already Delete',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.prisma.subCategory.create({
      data: {
        categoryId: payload.categoryId as string,
        categoryName: categoryNameFormate,
        adminId: tokenUser?.id,
      },
    });
    return result;
  }
  async updateSubCategoryDB(subCategoryId: string, payload: TCategory) {
    const { categoryName, ...others } = payload;
    const categoryNameFormate = formatCategoryName(categoryName);

    const isExistCategory = await this.prisma.category.findFirst({
      where: {
        categoryName: categoryNameFormate,
      },
    });

    if (isExistCategory) {
      throw new HttpException(
        'This Category already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isExistSubCategory = await this.prisma.subCategory.findFirst({
      where: {
        categoryName: categoryNameFormate,
        NOT: {
          id: subCategoryId,
        },
      },
    });
    if (isExistSubCategory) {
      throw new HttpException(
        'This SubCategory already exist',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const result = await this.prisma.subCategory.update({
      where: {
        id: subCategoryId,
      },
      data: {
        categoryName: categoryNameFormate,
        ...others,
      },
    });
    return result;
  }

  findAllCategoryDB = async (queryObj: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: categorySearchAbleFields?.map((field) => ({
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

    const result = await this.prisma.category.findMany({
      where: whereConditions as any,
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            isDelete: true,
          },
        },
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

    const total = await this.prisma.category.count({
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
  };

  async findAllSubCategoryDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: categorySearchAbleFields.map((field) => ({
          [field]: {
            contains: queryObj.searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (Object.keys(filterData).length > 0) {
      andCondition.push({
        AND: Object.keys(filterData)?.map((key) => ({
          [key]: {
            equals: filterData[key as never],
          },
        })),
      });
    }

    const whereConditions: Prisma.UserWhereInput = { AND: andCondition as any };

    const result = await this.prisma.subCategory.findMany({
      where: whereConditions as any,
      include: {
        category: true,
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            isDelete: true,
          },
        },
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

    const total = await this.prisma.subCategory.count({
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

  existFindAllCategoryDB = async () => {
    const result = await this.prisma.category.findMany({
      where: {
        isDelete: false,
      },
      select: {
        id: true,
        categoryName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result;
  };
  singleCategoryBaseFindAllSubCategoryDB = async (categoryId: string) => {
    await this.prisma.category.findUniqueOrThrow({
      where: {
        id: categoryId,
        isDelete: false,
      },
    });
    const result = await this.prisma.subCategory.findMany({
      where: {
        isDelete: false,
        category: {
          id: categoryId,
        },
      },
      select: {
        id: true,
        categoryName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result;
  };

  async publicFindAllCategoryWithSubCategoryDB() {
    const result = await this.prisma.category.findMany({
      select: {
        categoryName: true,
        id: true,
        subCategory: {
          select: {
            categoryName: true,
            id: true,
          },
        },
      },
      take: 10,
      orderBy: {
        categoryName: 'asc',
      },
    });
    return result;
  }
}
