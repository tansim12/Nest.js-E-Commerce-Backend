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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../Common/helper/paginationHelper");
const prisma_service_1 = require("../prisma.service");
const product_const_1 = require("./product.const");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
        this.publicCompareProductDB = async (productIds) => {
            if (productIds?.length > 3) {
                throw new common_1.HttpException('Longer then 3', common_1.HttpStatus.NOT_ACCEPTABLE);
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
        this.findSingleProductAllReviewDB = async (productId) => {
            const result = await this.prisma.productReview.findMany({
                where: {
                    payment: {
                        paymentAndProduct: {
                            some: {
                                productId,
                                paymentStatus: client_1.PaymentStatus.confirm,
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
    }
    async createProductDB(tokenUser, payload) {
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
    async updateProductDB(tokenUser, productId, payload) {
        const IsVendor = await this.prisma.user.findUnique({
            where: {
                id: tokenUser?.id,
                isDelete: false,
                status: client_1.UserStatus.active,
            },
        });
        if (IsVendor?.role === client_1.UserRole.vendor) {
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
    async findVendorShopAllProductsDB(tokenUser, queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: product_const_1.shopAllProductsSearchAbleFields?.map((field) => ({
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
        const vendorInfo = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: tokenUser?.id,
                isDelete: false,
                shop: {
                    vendorId: tokenUser?.id,
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
                id: vendorInfo?.shop?.id,
            },
            include: {
                product: {
                    where: {
                        ...whereConditions,
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
                    orderBy: options.sortBy && options.sortOrder
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
                id: vendorInfo?.shop?.id,
            },
            include: {
                product: {
                    where: {
                        ...whereConditions,
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
    async adminFindAllProductsDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.product.findMany({
            where: {
                ...whereConditions,
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
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.product.count({
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
    async publicTopSaleProductDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.product.findMany({
            where: {
                ...whereConditions,
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
                ...whereConditions,
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
    async publicSingleProductDb(productId) {
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
    async publicFlashSaleProductDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.product.findMany({
            where: {
                ...whereConditions,
                isDelete: false,
                isAvailable: true,
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
                ...whereConditions,
                isDelete: false,
                isAvailable: true,
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
    async publicPromoCheckDB(payload) {
        const currentDate = new Date();
        const product = await this.prisma.product.findFirst({
            where: {
                id: payload?.id,
                isDelete: false,
                shopId: payload?.shopId,
                isAvailable: true,
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
                            lte: currentDate,
                        },
                    },
                    {
                        flashSaleEndDate: {
                            gte: currentDate,
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
            newUnitPrice: product?.price - product?.flashSaleDiscount,
            id: product?.id,
        };
    }
    async publicAllProductsDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, priceStart, priceEnd, ...filterData } = queryObj;
        const andCondition = [];
        if (searchTerm) {
            andCondition.push({
                OR: product_const_1.shopAllProductsSearchAbleFields.map((field) => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                })),
            });
        }
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
                        equals: filterData[key],
                    },
                })),
            });
        }
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
        const whereConditions = {
            AND: andCondition,
            isDelete: false,
        };
        const result = await this.prisma.product.findMany({
            where: whereConditions,
            include: {
                category: true,
                subCategory: true,
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
        const total = await this.prisma.product.count({
            where: whereConditions,
        });
        return {
            meta: { page, limit, total },
            result,
        };
    }
    async findRelevantProductDB(categoryIds, queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
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
        }
        else {
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
    async productReviewByPaymentDB(tokenUser, paymentId, payload) {
        const paymentInfo = await this.prisma.payment.findUniqueOrThrow({
            where: {
                id: paymentId,
                paymentStatus: client_1.PaymentStatus.confirm,
            },
            include: {
                paymentAndProduct: {
                    select: {
                        product: true,
                    },
                },
            },
        });
        const productIds = paymentInfo.paymentAndProduct.map((item) => item?.product?.id);
        if (paymentInfo?.userId === tokenUser?.id) {
            const result = await this.prisma.$transaction(async (tx) => {
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
                        const findProduct = await tx.product.findFirst({
                            where: {
                                id: item,
                            },
                        });
                        if (!findProduct) {
                            continue;
                        }
                        const totalUserGiveRating = findProduct.totalUserGiveRating ?? 0;
                        const averageRating = totalUserGiveRating > 0
                            ? (payload.rating + findProduct.totalSubmitRating) /
                                (totalUserGiveRating + 1)
                            : payload.rating;
                        const totalSubmitRating = payload.rating + (findProduct.totalSubmitRating || 0);
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
                throw new common_1.HttpException('Some things went wrong', common_1.HttpStatus.CONFLICT);
            }
            return result;
        }
        else {
            throw new common_1.HttpException('User dose not match', common_1.HttpStatus.CONFLICT);
        }
    }
    async vendorOrShopRepliedReviewsDB(tokenUser, payload) {
        const findProductReviewInfo = await this.prisma.productReview.findUniqueOrThrow({
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
        }
        else {
            throw new common_1.HttpException('shop message update failed', common_1.HttpStatus.CONFLICT);
        }
    }
    async vendorFindHisAllProductDB(tokenUser) {
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
    async vendorFindSingleProductDB(tokenUser, productId) {
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
    async findUserAllReviewsDB(tokenUser) {
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
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map