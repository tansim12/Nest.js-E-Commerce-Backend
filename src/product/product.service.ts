/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentStatus, Prisma, UserRole, UserStatus } from '@prisma/client';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import { IPaginationOptions } from 'src/Common/interface/pagination';

import { PrismaService } from 'src/prisma.service';
import { shopAllProductsSearchAbleFields } from './product.const';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductDB(tokenUser: any, payload: any) {
    const vendorInfo = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser?.id,
        isDelete: false,
        shop: {
          vendorId: tokenUser?.id,
          isDelete: false,
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
    const result = await this.prisma.product.create({
      data: {
        ...payload,
        shopId: vendorInfo?.shop?.id,
      },
    });
    return result;
  }
  async updateProductDB(tokenUser: any, productId: string, payload: any) {
    const IsVendor = await this.prisma.user.findUnique({
      where: {
        id: tokenUser?.id,
        isDelete: false,
        status: UserStatus.active,
      },
    });

    if (IsVendor?.role === UserRole.vendor) {
      await this.prisma.product.findUniqueOrThrow({
        where: {
          id: productId,
          shop: {
            vendorId: IsVendor?.id,
            isDelete: false,
          },
        },
      });
    }
    const result = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: payload,
    });
    return result;
  }

  async findVendorShopAllProductsDB(
    tokenUser: any,
    queryObj: any,
    options: IPaginationOptions,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopAllProductsSearchAbleFields?.map((field) => ({
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

    const vendorInfo = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser?.id,
        isDelete: false,
        shop: {
          vendorId: tokenUser?.id,
          // isDelete: false,
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
    const result = await this.prisma.shop.findUniqueOrThrow({
      where: {
        // ...whereConditions,
        id: vendorInfo?.shop?.id,
      },
      include: {
        product: {
          where: {
            ...(whereConditions as any),
          },
          include: {
            category: {
              select: {
                categoryName: true,
                id: true,
              },
            },
            subCategory: {
              select: {
                categoryName: true,
                id: true,
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
        },
      },
    });
    const total = await this.prisma.shop.findUniqueOrThrow({
      where: {
        // ...whereConditions,
        id: vendorInfo?.shop?.id,
      },
      include: {
        product: {
          where: {
            ...(whereConditions as any),
          },
          select: {
            id: true,
          },
        },
      },
    });

    const meta = {
      page,
      limit,
      total: total.product.length,
    };
    return {
      meta,
      result,
    };
  }

  async adminFindAllProductsDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopAllProductsSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.product.findMany({
      where: {
        ...(whereConditions as any),
      },
      include: {
        category: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        subCategory: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        shop: {
          select: {
            name: true,
            id: true,
            logo: true,
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

    const total = await this.prisma.product.count({
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
  async publicTopSaleProductDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopAllProductsSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.product.findMany({
      where: {
        ...(whereConditions as any),
        isDelete: false,
        isAvailable: true,
        quantity: {
          gt: 1,
        },
      },
      include: {
        category: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        subCategory: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        shop: {
          select: {
            name: true,
            id: true,
            logo: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        totalBuy: 'desc',
      },
    });

    const total = await this.prisma.product.count({
      where: {
        ...(whereConditions as any),
        isDelete: false,
        isAvailable: true,
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

  async publicSingleProductDb(productId: string) {
    const result = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
        isDelete: false,
      },
      include: {
        category: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        subCategory: {
          select: {
            categoryName: true,
            id: true,
          },
        },
        shop: {
          select: {
            id: true,
            logo: true,
            name: true,
            _count: true,
            shopType: true,
          },
        },
      },
    });

    const relatedProduct = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            categoryId: result.categoryId,
          },
          {
            subCategoryId: result.subCategoryId,
          },
        ],
        NOT: {
          id: result.id,
        },
      },
      take: 5,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return {
      result,
      relatedProduct,
    };
  }

  async publicFlashSaleProductDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: shopAllProductsSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.product.findMany({
      where: {
        ...(whereConditions as any),
        isDelete: false,
        isAvailable: true,
        // flash sale হওয়ার condition
        isActivePromo: true,
        promo: {
          not: null,
        },
        flashSaleDiscount: {
          not: null,
        },
        flashSaleEndDate: {
          not: null,
        },
        flashSaleStartDate: {
          not: null,
        },
        isFlashSaleOffer: true,
        quantity: {
          gt: 1,
        },
      },

      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const total = await this.prisma.product.count({
      where: {
        ...(whereConditions as any),
        isDelete: false,
        isAvailable: true,
        // flash sale হওয়ার condition
        isActivePromo: true,
        promo: {
          not: null,
        },
        flashSaleDiscount: {
          not: null,
        },
        flashSaleEndDate: {
          not: null,
        },
        flashSaleStartDate: {
          not: null,
        },
        isFlashSaleOffer: true,
        quantity: {
          gt: 1,
        },
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

  async publicPromoCheckDB(payload: any) {
    const currentDate = new Date();

    const product = await this.prisma.product.findFirst({
      where: {
        id: payload?.id,
        isDelete: false,
        shopId: payload?.shopId,
        isAvailable: true,
        // Flash Sale শর্ত
        isActivePromo: true,
        promo: {
          equals: payload?.promo,
        },
        flashSaleDiscount: {
          not: null,
        },
        AND: [
          {
            flashSaleStartDate: {
              lte: currentDate, // শুরু হয়েছে বা আজ শুরু
            },
          },
          {
            flashSaleEndDate: {
              gte: currentDate, // এখনো চলছে বা আজ শেষ
            },
          },
        ],
        isFlashSaleOffer: true,
        quantity: {
          gt: 1,
        },
      },
    });

    if (!product) {
      return {
        status: 400,
        message: 'This Promo Not Available',
      };
    }
    return {
      status: 200,
      message: 'Congratulations, you got a discount!',
      newUnitPrice: product?.price - (product?.flashSaleDiscount as number),
      id: product?.id,
    };
  }

  async publicAllProductsDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, priceStart, priceEnd, ...filterData } = queryObj;

    const andCondition = [];

    // Search term condition
    if (searchTerm) {
      andCondition.push({
        OR: shopAllProductsSearchAbleFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Filter conditions
    if (Object.keys(filterData).length > 0) {
      if (filterData?.isAvailable) {
        filterData.isAvailable =
          typeof filterData.isAvailable === 'string'
            ? filterData.isAvailable === 'true'
            : filterData.isAvailable;
      }

      andCondition.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: filterData[key as never],
          },
        })),
      });
    }

    // Price range filter (conditionally added)
    if (priceStart !== undefined || priceEnd !== undefined) {
      const priceConditions = [];
      if (priceStart !== undefined) {
        priceConditions.push({
          price: {
            gte: Number(priceStart),
          },
        });
      }
      if (priceEnd !== undefined) {
        priceConditions.push({
          price: {
            lte: Number(priceEnd),
          },
        });
      }
      andCondition.push(...priceConditions);
    }

    const whereConditions: Prisma.UserWhereInput = {
      AND: andCondition as any,
      isDelete: false, // Always exclude deleted products
    };

    // Fetch filtered products
    const result = await this.prisma.product.findMany({
      where: whereConditions as any,
      include: {
        category: true,
        subCategory: true,
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

    // Count total filtered products
    const total = await this.prisma.product.count({
      where: whereConditions as any,
    });

    return {
      meta: { page, limit, total },
      result,
    };
  }

  publicCompareProductDB = async (productIds: string[]) => {
    if (productIds?.length > 3) {
      throw new HttpException('Longer then 3', HttpStatus.NOT_ACCEPTABLE);
    }
    const result = await this.prisma.product.findMany({
      where: {
        isDelete: false,
        id: {
          in: productIds,
        },
      },
      include: {
        category: true,
      },
    });
    return result;
  };

  async findRelevantProductDB(
    categoryIds: string[],
    queryObj: any,
    options: IPaginationOptions,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    if (categoryIds?.length > 0) {
      const result = await this.prisma.product.findMany({
        where: {
          isDelete: false,
          categoryId: {
            in: categoryIds,
          },
        },

        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
      });

      const total = await this.prisma.product.count({
        where: {
          isDelete: false,
          categoryId: {
            in: categoryIds,
          },
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
    } else {
      const result = await this.prisma.product.findMany({
        where: {
          isDelete: false,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      });
      const total = await this.prisma.product.count();

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

  async productReviewByPaymentDB(
    tokenUser: any,
    paymentId: string,
    payload: any,
  ) {
    const paymentInfo = await this.prisma.payment.findUniqueOrThrow({
      where: {
        id: paymentId,
        paymentStatus: PaymentStatus.confirm,
      },
      include: {
        paymentAndProduct: {
          select: {
            product: true,
          },
        },
      },
    });

    const productIds = paymentInfo.paymentAndProduct.map(
      (item: any) => item?.product?.id,
    );

    // check is user create review table
    if (paymentInfo?.userId === tokenUser?.id) {
      const result = await this.prisma.$transaction(async (tx) => {
        // create review
        const createReview = await tx.productReview.create({
          data: {
            paymentId: paymentInfo.id,
            userId: paymentInfo.userId,
            userMessage: payload?.userMessage,
            rating: payload?.rating ? payload?.rating : null,
          },
        });
        if (payload?.rating === 0 || payload?.rating) {
          for (const item of productIds) {
            // Find the product
            const findProduct = await tx.product.findFirst({
              where: {
                id: item,
              },
            });

            if (!findProduct) {
              continue; // Skip if the product is not found
            }

            // Calculate averageRating and totalSubmitRating
            const totalUserGiveRating = findProduct.totalUserGiveRating ?? 0;
            const averageRating =
              totalUserGiveRating > 0
                ? (payload.rating + findProduct.totalSubmitRating) /
                  (totalUserGiveRating + 1)
                : payload.rating;
            const totalSubmitRating =
              payload.rating + (findProduct.totalSubmitRating || 0);

            // Update product
            await tx.product.update({
              where: {
                id: item,
              },
              data: {
                averageRating: Math.ceil(averageRating),
                totalSubmitRating: totalSubmitRating,
                totalUserGiveRating: totalUserGiveRating + 1,
              },
            });
          }
        }
        return createReview;
      });

      if (!result) {
        throw new HttpException('Some things went wrong', HttpStatus.CONFLICT);
      }
      return result;
    } else {
      throw new HttpException('User dose not match', HttpStatus.CONFLICT);
    }
  }

  async vendorOrShopRepliedReviewsDB(tokenUser: any, payload: any) {
    const findProductReviewInfo =
      await this.prisma.productReview.findUniqueOrThrow({
        where: {
          userId_paymentId: {
            userId: payload?.userId,
            paymentId: payload?.paymentId,
          },
        },
      });

    if (!findProductReviewInfo?.shopMessage && payload?.shopMessage) {
      const updateShopMessage = await this.prisma.productReview.update({
        where: {
          userId_paymentId: {
            userId: findProductReviewInfo?.userId,
            paymentId: findProductReviewInfo?.paymentId,
          },
        },
        data: {
          shopMessage: payload?.shopMessage,
        },
      });
      return updateShopMessage;
    } else {
      throw new HttpException(
        'shop message update failed',
        HttpStatus.CONFLICT,
      );
    }
  }

  findSingleProductAllReviewDB = async (productId: string) => {
    const result = await this.prisma.productReview.findMany({
      where: {
        payment: {
          paymentAndProduct: {
            some: {
              productId,
              paymentStatus: PaymentStatus.confirm,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            userProfile: {
              select: {
                profilePhoto: true,
              },
            },
          },
        },
      },
      take: 15,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result;
  };

  async vendorFindHisAllProductDB(tokenUser: any) {
    const result = this.prisma.product.findMany({
      where: {
        shop: {
          vendorId: tokenUser?.id,
        },
        isDelete: false,
      },
      select: {
        id: true,
        productName: true,
      },
    });
    return result;
  }
  async vendorFindSingleProductDB(tokenUser: any, productId: string) {
    const result = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId,
        shop: {
          vendorId: tokenUser?.id,
        },
        isDelete: false,
      },
    });
    return result;
  }

  async findUserAllReviewsDB(tokenUser: any) {
    const result = await this.prisma.productReview.findMany({
      where: {
        userId: tokenUser?.id,
      },
      include: {
        payment: {
          select: {
            paymentAndProduct: {
              select: {
                product: {
                  select: {
                    images: true,
                    productName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return result;
  }
}
