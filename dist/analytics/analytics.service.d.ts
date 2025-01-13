import { PrismaService } from 'src/prisma.service';
import { EmailUtils } from 'src/Common/utils/emil.utils';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly emailUtils;
    constructor(prisma: PrismaService, emailUtils: EmailUtils);
    adminAnalyticsDB(): Promise<{
        revenueByMonth: {
            month: string;
            revenue: number;
        }[];
        paymentStatusBaseInfo: {
            confirm: number;
            pending: number;
            cancel: number;
        };
        userInfo: {
            active: number;
            blocked: number;
            totalUsers: number;
        };
        shopInfo: {
            active: number;
            deactive: number;
            totalShops: number;
        };
    }>;
    shopAnalyticsDB(tokenUser: any): Promise<{
        totalRevenueData: import(".prisma/client").Prisma.GetPaymentAggregateType<{
            _sum: {
                amount: true;
            };
            where: {
                shopId: string;
                paymentStatus: "confirm";
            };
        }>;
        revenueByMonth: {
            month: string;
            revenue: number;
        }[];
        totalActiveProducts: number;
        totalInactiveProducts: number;
        totalFlashSaleProducts: number;
    }>;
    createNewsletterDB(payload: any): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllNewsLetterEmailDB(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    newsletterGroupMessageSendDB(payload: any): Promise<void>;
}
