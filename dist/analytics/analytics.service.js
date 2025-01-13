"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const date_fns_1 = require("date-fns");
const client_1 = require("@prisma/client");
const emil_utils_1 = require("../Common/utils/emil.utils");
let AnalyticsService = class AnalyticsService {
    constructor(prisma, emailUtils) {
        this.prisma = prisma;
        this.emailUtils = emailUtils;
    }
    async adminAnalyticsDB() {
        const monthlyRevenue = await this.prisma.payment.groupBy({
            by: ['createdAt'],
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                },
                paymentStatus: 'confirm',
            },
        });
        const revenueByMonth = Array(12)
            .fill(0)
            .map((_, i) => ({
            month: (0, date_fns_1.format)(new Date(new Date().getFullYear(), i, 1), 'MMMM'),
            revenue: 0,
        }));
        for (const record of monthlyRevenue) {
            const monthIndex = new Date(record.createdAt).getMonth();
            revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
        }
        const statusCounts = await this.prisma.payment.groupBy({
            by: ['paymentStatus'],
            _count: {
                paymentStatus: true,
            },
        });
        const paymentStatusBaseInfo = statusCounts.reduce((acc, record) => {
            acc[record.paymentStatus] = record._count.paymentStatus;
            return acc;
        }, { confirm: 0, pending: 0, cancel: 0 });
        const totalUsers = await this.prisma.user.count();
        const userStatusCounts = await this.prisma.user.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });
        const formattedCounts = userStatusCounts.reduce((acc, record) => {
            acc[record.status] = record._count.status;
            return acc;
        }, { active: 0, blocked: 0 });
        const totalShops = await this.prisma.shop.count();
        const shopStatusCounts = await this.prisma.shop.groupBy({
            by: ['isDelete'],
            _count: {
                isDelete: true,
            },
        });
        const formattedCountShop = shopStatusCounts.reduce((acc, record) => {
            if (record.isDelete) {
                acc.deactive = record._count.isDelete;
            }
            else {
                acc.active = record._count.isDelete;
            }
            return acc;
        }, { active: 0, deactive: 0 });
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
    async shopAnalyticsDB(tokenUser) {
        const findShop = await this.prisma.user?.findUnique({
            where: {
                id: tokenUser?.id,
                isDelete: false,
                role: client_1.UserRole.vendor,
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
            throw new common_1.HttpException('Shop not found', common_1.HttpStatus.NOT_FOUND);
        }
        const shopId = findShop?.shop?.id;
        const totalRevenueData = await this.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                shopId,
                paymentStatus: 'confirm',
            },
        });
        const monthlyRevenue = await this.prisma.payment.groupBy({
            by: ['createdAt'],
            _sum: {
                amount: true,
            },
            where: {
                shopId: shopId,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                },
                paymentStatus: 'confirm',
            },
        });
        const revenueByMonth = Array(12)
            .fill(0)
            .map((_, i) => ({
            month: (0, date_fns_1.format)(new Date(new Date().getFullYear(), i, 1), 'MMMM'),
            revenue: 0,
        }));
        for (const record of monthlyRevenue) {
            const monthIndex = new Date(record.createdAt).getMonth();
            revenueByMonth[monthIndex].revenue += record._sum.amount || 0;
        }
        const totalActiveProducts = await this.prisma.product.count({
            where: {
                shopId,
                isDelete: false,
            },
        });
        const totalInactiveProducts = await this.prisma.product.count({
            where: {
                shopId,
                isDelete: true,
            },
        });
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
    async createNewsletterDB(payload) {
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
    async newsletterGroupMessageSendDB(payload) {
        const result = await this.emailUtils.sendManyEmails(payload?.emailArray, payload?.subject, payload?.message);
        return result;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emil_utils_1.EmailUtils])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map