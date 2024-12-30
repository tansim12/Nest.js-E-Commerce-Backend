import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { format } from 'date-fns';
import { UserRole } from '@prisma/client';
import { EmailUtils } from 'src/Common/utils/emil.utils';
@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailUtils: EmailUtils,
  ) {}
  async adminAnalyticsDB() {
    // Aggregate revenue grouped by months
    const monthlyRevenue = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 1), // From January 1st of this year
        },
        paymentStatus: 'confirm', // Only confirmed payments
      },
    });

    // Format the data to group by months
    const revenueByMonth: { month: string; revenue: number }[] = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: format(new Date(new Date().getFullYear(), i, 1), 'MMMM'), // Full month name
        revenue: 0,
      }));

    // Populate revenue in the correct month
    for (const record of monthlyRevenue) {
      const monthIndex = new Date(record.createdAt).getMonth();
      revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
    }

    //! payment status base info
    // Count payments grouped by status
    const statusCounts = await this.prisma.payment.groupBy({
      by: ['paymentStatus'],
      _count: {
        paymentStatus: true,
      },
    });

    // Format the result
    const paymentStatusBaseInfo = statusCounts.reduce(
      (acc, record) => {
        acc[record.paymentStatus] = record._count.paymentStatus;
        return acc;
      },
      { confirm: 0, pending: 0, cancel: 0 },
    );

    //! use status base info
    const totalUsers = await this.prisma.user.count();

    // Active and blocked user count
    const userStatusCounts = await this.prisma.user.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Format the result
    const formattedCounts = userStatusCounts.reduce(
      (acc, record) => {
        acc[record.status] = record._count.status;
        return acc;
      },
      { active: 0, blocked: 0 },
    );

    // ! shop isDelete base data

    // Total shop count
    const totalShops = await this.prisma.shop.count();

    // Active and deactive shop count
    const shopStatusCounts = await this.prisma.shop.groupBy({
      by: ['isDelete'],
      _count: {
        isDelete: true,
      },
    });

    // Format the result
    const formattedCountShop = shopStatusCounts.reduce(
      (acc, record) => {
        if (record.isDelete) {
          acc.deactive = record._count.isDelete;
        } else {
          acc.active = record._count.isDelete;
        }
        return acc;
      },
      { active: 0, deactive: 0 },
    );

    return {
      revenueByMonth,
      paymentStatusBaseInfo,
      userInfo: {
        totalUsers,
        ...formattedCounts,
      },
      shopInfo: {
        totalShops,
        ...formattedCountShop,
      },
    };
  }

  //! shop analytics
  async shopAnalyticsDB(tokenUser: any) {
    const findShop = await this.prisma.user?.findUnique({
      where: {
        id: tokenUser?.id,
        isDelete: false,
        role: UserRole.vendor,
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
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
    const shopId = findShop?.shop?.id;

    // Total revenue
    const totalRevenueData = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        shopId,
        paymentStatus: 'confirm',
      },
    });

    //   monthly revenue
    const monthlyRevenue = await this.prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: {
        amount: true,
      },
      where: {
        shopId: shopId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 1), // From January 1st of this year
        },
        paymentStatus: 'confirm', // Only confirmed payments
      },
    });

    // Format the data to group by months
    const revenueByMonth: { month: string; revenue: number }[] = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: format(new Date(new Date().getFullYear(), i, 1), 'MMMM'), // Full month name
        revenue: 0,
      }));

    // Populate revenue in the correct month
    for (const record of monthlyRevenue) {
      const monthIndex = new Date(record.createdAt).getMonth();
      revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
    }

    //! product data
    // Total active products
    const totalActiveProducts = await this.prisma.product.count({
      where: {
        shopId,
        isDelete: false,
      },
    });

    // Total inactive products
    const totalInactiveProducts = await this.prisma.product.count({
      where: {
        shopId,
        isDelete: true,
      },
    });

    // Total products with flash sale active
    const totalFlashSaleProducts = await this.prisma.product.count({
      where: {
        shopId,
        isFlashSaleOffer: true,
      },
    });

    return {
      totalRevenueData,
      revenueByMonth,
      totalActiveProducts,
      totalInactiveProducts,
      totalFlashSaleProducts,
    };
  }

  async createNewsletterDB(payload: any) {
    const result = await this.prisma.newsletter.create({
      data: payload,
    });
    return result;
  }
  async findAllNewsLetterEmailDB() {
    const result = await this.prisma.newsletter.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return result;
  }

  async newsletterGroupMessageSendDB(payload: any) {
    const result = await this.emailUtils.sendManyEmails(
      payload?.emailArray,
      payload?.subject,
      payload?.message,
    );

    return result;
  }
}
