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
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const paginationHelper_1 = require("../Common/helper/paginationHelper");
const prisma_service_1 = require("../prisma.service");
const shop_const_1 = require("./shop.const");
const client_1 = require("@prisma/client");
let ShopService = class ShopService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crateShopDB(tokenUser, payload) {
        await this.prisma.user.findUniqueOrThrow({
            where: {
                id: tokenUser.id,
                isDelete: false,
                OR: [
                    {
                        role: client_1.UserRole.admin,
                    },
                    {
                        role: client_1.UserRole.vendor,
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
                        role: client_1.UserRole.vendor,
                    },
                ],
            },
        });
        const result = await this.prisma.shop.create({
            data: payload,
        });
        return result;
    }
    async findSingleShopPublicDB(shopId, queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
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
    async findAllShopPublicDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: shop_const_1.shopSearchAbleFields.map((field) => ({
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
                        equals: filterData[key],
                    },
                })),
            });
        }
        const whereConditions = { AND: andCondition };
        const result = await this.prisma.shop.findMany({
            where: {
                ...whereConditions,
                isDelete: false,
            },
            select: {
                id: true,
                logo: true,
                name: true,
                _count: true,
                shopType: true,
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'asc',
                },
        });
        const total = await this.prisma.shop.count({
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
    async shopFollowingDB(tokenUser, payload) {
        const userInfo = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: tokenUser.id,
                isDelete: false,
                status: client_1.UserStatus.active,
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
    async shopReviewDB(tokenUser, payload) {
        const userInfo = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: tokenUser.id,
                isDelete: false,
                status: client_1.UserStatus.active,
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
    async vendorFindHisShopDB(tokenUser) {
        const result = await this.prisma.shop.findUnique({
            where: {
                vendorId: tokenUser?.id,
            },
        });
        return result;
    }
    async updateShopInfoDB(tokenUser, shopId, payload) {
        const isVendor = await this.prisma.user.findUnique({
            where: {
                id: tokenUser.id,
                role: client_1.UserRole.vendor,
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
    async adminFindAllShopDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: shop_const_1.shopSearchAbleFields.map((field) => ({
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
                        equals: filterData[key],
                    },
                })),
            });
        }
        const whereConditions = { AND: andCondition };
        const result = await this.prisma.shop.findMany({
            where: {
                ...whereConditions,
            },
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.shop.count({
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
    async findSingleUserFollowDB(tokenUser, shopId) {
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
    async isShopExistDb(tokenUser) {
        const findShop = await this.prisma.user?.findUnique({
            where: {
                id: tokenUser?.id,
                isDelete: false,
                role: client_1.UserRole.vendor,
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
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopService);
//# sourceMappingURL=shop.service.js.map