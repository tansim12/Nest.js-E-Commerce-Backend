/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import { v7 as uuidv7 } from 'uuid';
import { verifyPayment } from 'src/Common/utils/verifyPayment';
import { PaymentStatus, Prisma } from '@prisma/client';
import { IPaginationOptions } from 'src/Common/interface/pagination';
import { paginationHelper } from 'src/Common/helper/paginationHelper';
import { paymentInfoSearchAbleFields } from './payment.const';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async paymentDB(tokenUser: any, body: any) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: tokenUser?.id,
      },
    });

    // console.log(body);
    const initialShopId = body?.[0]?.shopId;
    const shopId = body?.find((item: any) => {
      if (initialShopId !== item?.shopId) {
        throw new HttpException('ShopId not match', HttpStatus.ACCEPTED);
      }
    });

    const usedPromoProductIds = body
      ?.filter((item: any) => item?.isPromoUse === true) // Filter items where isPromoUse is true
      ?.map((item: any) => item.id); // Map to extract the id of each filtered item

    // db থেকে প্রোডাক্ট বের করছি
    const findWithPromoProducts = await this.prisma.product.findMany({
      where: {
        isDelete: false,
        isAvailable: true,

        id: {
          in: usedPromoProductIds,
        },
      },
      select: {
        id: true,
        price: true,
        flashSaleDiscount: true,
        quantity: true,
      },
    });

    // promo code use করা  গুলোর quantity আলাদা করছি
    const usedPromoProductIdAndBuyQuantity = body
      ?.filter((item: any) => item?.isPromoUse === true) // Filter items where isPromoUse is true
      ?.map((item: any) => ({
        id: item?.id,
        buyQuantity: item?.buyQuantity,
      })); // Map to extract the id of each filtered item
    // console.log({ usedPromoProductIdAndBuyQuantity });

    const withPromoProductCalculationResult = usedPromoProductIdAndBuyQuantity
      .map((promoItem: any) => {
        const product = findWithPromoProducts.find(
          (item) => item.id === promoItem.id,
        );

        if (product) {
          const totalBuyQuantity = Math.min(
            promoItem.buyQuantity,
            product.quantity,
          ); // বড় হলে, স্টকের সীমায় রাখুন

          const totalPrice =
            totalBuyQuantity *
            (product.price - (product.flashSaleDiscount || 0)); // price + flashSaleDiscount

          return {
            id: promoItem.id,
            totalBuyQuantity,
            totalPrice,
          };
        }

        return null; // যদি প্রোডাক্ট না মেলে
      })
      .filter(Boolean); // null বা undefined বাদ দিন

    //!
    const normalProductIds = body
      ?.filter((item: any) => item?.isPromoUse !== true) // Filter items where isPromoUse is true
      ?.map((item: any) => item.id); // Map to extract the id of each filtered item

    const findWithOutPromoProducts = await this.prisma.product.findMany({
      where: {
        isDelete: false,
        isAvailable: true,

        id: {
          in: normalProductIds,
        },
      },
      select: {
        id: true,
        price: true,
        discount: true,
        quantity: true,
      },
    });

    // promo code use করা  গুলোর quantity আলাদা করছি
    const normalBuyQuantity = body
      ?.filter((item: any) => item?.isPromoUse !== true) // Filter items where isPromoUse is true
      ?.map((item: any) => ({
        id: item?.id,
        buyQuantity: item?.buyQuantity,
      })); // Map to extract the id of each filtered item

    const normalProductCalculationResult = normalBuyQuantity
      .map((promoItem: any) => {
        const product = findWithOutPromoProducts.find(
          (item) => item.id === promoItem.id,
        );

        if (product) {
          const totalBuyQuantity = Math.min(
            promoItem.buyQuantity,
            product.quantity,
          ); // বড় হলে, স্টকের সীমায় রাখুন

          const totalPrice =
            totalBuyQuantity * (product.price - (product.discount || 0)); // price + flashSaleDiscount

          return {
            id: promoItem.id,
            totalBuyQuantity,
            totalPrice,
          };
        }

        return null; // যদি প্রোডাক্ট না মেলে
      })
      .filter(Boolean); // null বা undefined বাদ দিন
    //! this is important
    // console.log({
    //   normalProductCalculationResult,
    //   withPromoProductCalculationResult,
    // });

    const normalTotalPrice =
      normalProductCalculationResult?.reduce(
        (acc: any, item: any) => acc + item?.totalPrice,
        0,
      ) || 0;
    const promoTotalPrice =
      withPromoProductCalculationResult?.reduce(
        (acc: any, item: any) => acc + item?.totalPrice,
        0,
      ) || 0;
    const mainTotalPrice = normalTotalPrice + promoTotalPrice;

    // return mainTotalPrice;
    // console.log({ mainTotalPrice });

    const transactionId = uuidv7(); // Generate a UUID
    const currentTime = new Date().toISOString(); // or use Date.now() for a timestamp in milliseconds
    // Concatenate UUID with current time
    const combinedTransactionId = `${transactionId}-${currentTime}`;
    // db save

    const initialDataCreate = await this.prisma.$transaction(async (tx) => {
      const createPayment = await tx.payment.create({
        data: {
          shopId: initialShopId,
          amount: mainTotalPrice,
          txId: combinedTransactionId,
          userId: tokenUser?.id,
        },
      });

      // Create entries in paymentAndProduct for normal products
      if (normalProductCalculationResult?.length) {
        const normalProductPromises = normalProductCalculationResult.map(
          (item: any) => {
            return tx.paymentAndProduct.create({
              data: {
                productId: item?.id,
                selectQuantity: item?.totalBuyQuantity,
                payTotalAmount: item?.totalPrice,
                paymentId: createPayment?.id,
              },
            });
          },
        );
        // Wait for all normal product inserts to complete
        await Promise.all(normalProductPromises);
      }

      // Create entries in paymentAndProduct for promo products
      if (withPromoProductCalculationResult?.length) {
        const promoProductPromises = withPromoProductCalculationResult.map(
          (item: any) => {
            return tx.paymentAndProduct.create({
              data: {
                productId: item?.id,
                selectQuantity: item?.totalBuyQuantity,
                payTotalAmount: item?.totalPrice,
                paymentId: createPayment?.id,
              },
            });
          },
        );
        // Wait for all promo product inserts to complete
        await Promise.all(promoProductPromises);
      }

      return createPayment;
    });

    if (!initialDataCreate) {
      throw new HttpException('Initial Db insert failed', HttpStatus.CONFLICT);
    }

    const formData = {
      cus_name: `${user?.name ? user?.name : 'N/A'}`,
      cus_email: `${user?.email ? user?.email : 'N/A'}`,
      cus_phone: `${'N/A'}`,
      amount: initialDataCreate?.amount,
      tran_id: combinedTransactionId,
      signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
      store_id: 'aamarpaytest',
      currency: 'BDT',
      desc: combinedTransactionId,
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_country: 'Bangladesh',
      success_url: `${process.env.BASE_URL}/api/payment/callback?txnId=${combinedTransactionId}&userId=${user?.id}&paymentId=${initialDataCreate?.id}`,

      fail_url: `${process.env.BASE_URL}/api/payment/callback`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`, // its redirect to frontend directly
      type: 'json', //This is must required for JSON request
    };

    const { data } = await axios.post(
      `${process.env.AAMAR_PAY_HIT_API}`,
      formData,
    );

    if (data.result !== 'true') {
      let errorMessage = '';
      for (const key in data) {
        errorMessage += data[key] + '. ';
      }
      return errorMessage;
    }
    return {
      url: data.payment_url,
    };
  }

  async callbackDB(body: any, query: any) {
    if (body && body?.status_code === '7') {
      return {
        success: false,
      };
    }
    const { paymentId, userId, txnId } = query;
    const paymentInfo = await this.prisma.payment.findUniqueOrThrow({
      where: {
        id: paymentId,
      },
      include: {
        paymentAndProduct: true,
      },
    });

    try {
      if (body && body?.status_code === '2') {
        const verifyPaymentData = await verifyPayment(query?.txnId);
        if (verifyPaymentData && verifyPaymentData?.status_code === '2') {
          // Destructuring the necessary data
          const { approval_code, payment_type, amount, cus_phone, mer_txnid } =
            verifyPaymentData;
          // Prepare the payment data

          // Update user isVerified field
          const result = await this.prisma.$transaction(async (tx) => {
            const paymentAndProductIds = paymentInfo?.paymentAndProduct.map(
              (item: any) => item?.id,
            );
            const productsUpdateInfo = paymentInfo?.paymentAndProduct.map(
              (item: any) => ({
                productId: item?.productId,
                selectQuantity: item?.selectQuantity,
              }),
            );

            const updatePayment = await tx.payment.update({
              where: {
                id: paymentInfo?.id,
              },
              data: {
                amount: Number(amount),
                approval_code: approval_code,
                payment_type: payment_type,
                paymentStatus: PaymentStatus.confirm,
                mer_txnid: mer_txnid,
              },
            });

            // update
            await tx.paymentAndProduct.updateMany({
              where: {
                id: {
                  in: paymentAndProductIds,
                },
              },
              data: {
                paymentStatus: PaymentStatus.confirm,
              },
            });

            // update product quantity and buyQuantity increment

            const productUpdatePromise = productsUpdateInfo?.map(
              async (item: any) => {
                const product = await this.prisma.product.findUnique({
                  where: {
                    id: item?.productId,
                  },
                });

                if ((product?.quantity as number) < item?.selectQuantity) {
                  await tx.product.update({
                    where: {
                      id: item?.productId,
                    },
                    data: {
                      quantity: 0,
                      isAvailable: false,
                      totalBuy: product?.totalBuy + item?.selectQuantity,
                    },
                  });
                }
                if (
                  (product?.quantity as number) - item?.selectQuantity ===
                  0
                ) {
                  await tx.product.update({
                    where: {
                      id: item?.productId,
                    },
                    data: {
                      quantity:
                        (product?.quantity as number) - item?.selectQuantity,
                      isAvailable: false,
                      totalBuy: product?.totalBuy + item?.selectQuantity,
                    },
                  });
                } else {
                  await tx.product.update({
                    where: {
                      id: item?.productId,
                    },
                    data: {
                      quantity:
                        (product?.quantity as number) - item?.selectQuantity,
                      totalBuy: product?.totalBuy + item?.selectQuantity,
                    },
                  });
                }
              },
            );
            // Wait for all normal product inserts to complete
            await Promise.all(productUpdatePromise);

            return updatePayment;
          });
          //! Save the payment info

          // Commit the transaction
          if (!result) {
            return {
              success: false,
            };
          }
          return {
            success: true,
            txnId: query?.txnId,
          };
        }
      }
    } catch (error) {
      throw new HttpException('Payment Failed', HttpStatus.PRECONDITION_FAILED); // Rethrow the error to handle it outside the function
    }
  }

  async myAllPaymentInfoDB(
    tokenUser: any,
    queryObj: any,
    options: IPaginationOptions,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: paymentInfoSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.payment.findMany({
      where: {
        ...(whereConditions as any),
        userId: tokenUser?.id,
        NOT: {
          paymentStatus: PaymentStatus.pending,
        },
      },
      include: {
        paymentAndProduct: {
          include: {
            product: {
              select: {
                productName: true,
                images: true,
              },
            },
          },
        },
        productReview: true,
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

    const total = await this.prisma.payment.count({
      where: {
        ...(whereConditions as any),
        userId: tokenUser?.id,
        NOT: {
          paymentStatus: PaymentStatus.pending,
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

  // admin all payments
  async allPaymentInfoDB(queryObj: any, options: IPaginationOptions) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: paymentInfoSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.payment.findMany({
      where: {
        ...(whereConditions as any),
        NOT: {
          paymentStatus: PaymentStatus.pending,
        },
      },
      include: {
        paymentAndProduct: {
          include: {
            product: {
              select: {
                productName: true,
                images: true,
              },
            },
          },
        },
        productReview: true,
        _count: {
          select: {
            productReview: true,
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

    const total = await this.prisma.payment.count({
      where: {
        ...(whereConditions as any),
        NOT: {
          paymentStatus: PaymentStatus.pending,
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
  // shop  all payments
  async shopAllPaymentDB(
    tokenUser: any,
    queryObj: any,
    options: IPaginationOptions,
  ) {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = queryObj;

    const andCondition = [];
    if (queryObj.searchTerm) {
      andCondition.push({
        OR: paymentInfoSearchAbleFields.map((field) => ({
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

    const result = await this.prisma.payment.findMany({
      where: {
        ...(whereConditions as any),
        NOT: {
          paymentStatus: PaymentStatus.pending,
        },
        shop: {
          vendorId: tokenUser?.id,
        },
      },
      include: {
        paymentAndProduct: {
          include: {
            product: {
              select: {
                productName: true,
                images: true,
              },
            },
          },
        },
        productReview: true,
        _count: {
          select: {
            productReview: true,
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

    const total = await this.prisma.payment.count({
      where: {
        ...(whereConditions as any),
        NOT: {
          paymentStatus: PaymentStatus.pending,
        },
        shop: {
          vendorId: tokenUser?.id,
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

  async adminAndVendorUpdatePaymentDB(paymentId: string, payload: any) {
    const paymentInfo = await this.prisma.payment.findUniqueOrThrow({
      where: {
        id: paymentId,
      },
      include: {
        paymentAndProduct: true,
      },
    });
    const paymentAndProductIds = paymentInfo?.paymentAndProduct?.map(
      (item: any) => item?.id,
    );
    const result = await this.prisma.$transaction(async (tx) => {
      const updatePaymentStatus = await tx.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          paymentStatus: payload?.paymentStatus as any,
        },
      });
      await tx.paymentAndProduct.updateMany({
        where: {
          id: {
            in: paymentAndProductIds,
          },
        },
        data: {
          paymentStatus: payload?.paymentStatus as any,
        },
      });
      return updatePaymentStatus;
    });
    return result;
  }
}
