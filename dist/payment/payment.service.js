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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
const axios_1 = require("axios");
const uuid_1 = require("uuid");
const verifyPayment_1 = require("../Common/utils/verifyPayment");
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../Common/helper/paginationHelper");
const payment_const_1 = require("./payment.const");
let PaymentService = class PaymentService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async paymentDB(tokenUser, body) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: tokenUser?.id,
            },
        });
        const initialShopId = body?.[0]?.shopId;
        const shopId = body?.find((item) => {
            if (initialShopId !== item?.shopId) {
                throw new common_1.HttpException('ShopId not match', common_1.HttpStatus.ACCEPTED);
            }
        });
        const usedPromoProductIds = body
            ?.filter((item) => item?.isPromoUse === true)
            ?.map((item) => item.id);
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
        const usedPromoProductIdAndBuyQuantity = body
            ?.filter((item) => item?.isPromoUse === true)
            ?.map((item) => ({
            id: item?.id,
            buyQuantity: item?.buyQuantity,
        }));
        const withPromoProductCalculationResult = usedPromoProductIdAndBuyQuantity
            .map((promoItem) => {
            const product = findWithPromoProducts.find((item) => item.id === promoItem.id);
            if (product) {
                const totalBuyQuantity = Math.min(promoItem.buyQuantity, product.quantity);
                const totalPrice = totalBuyQuantity *
                    (product.price - (product.flashSaleDiscount || 0));
                return {
                    id: promoItem.id,
                    totalBuyQuantity,
                    totalPrice,
                };
            }
            return null;
        })
            .filter(Boolean);
        const normalProductIds = body
            ?.filter((item) => item?.isPromoUse !== true)
            ?.map((item) => item.id);
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
        const normalBuyQuantity = body
            ?.filter((item) => item?.isPromoUse !== true)
            ?.map((item) => ({
            id: item?.id,
            buyQuantity: item?.buyQuantity,
        }));
        const normalProductCalculationResult = normalBuyQuantity
            .map((promoItem) => {
            const product = findWithOutPromoProducts.find((item) => item.id === promoItem.id);
            if (product) {
                const totalBuyQuantity = Math.min(promoItem.buyQuantity, product.quantity);
                const totalPrice = totalBuyQuantity * (product.price - (product.discount || 0));
                return {
                    id: promoItem.id,
                    totalBuyQuantity,
                    totalPrice,
                };
            }
            return null;
        })
            .filter(Boolean);
        const normalTotalPrice = normalProductCalculationResult?.reduce((acc, item) => acc + item?.totalPrice, 0) || 0;
        const promoTotalPrice = withPromoProductCalculationResult?.reduce((acc, item) => acc + item?.totalPrice, 0) || 0;
        const mainTotalPrice = normalTotalPrice + promoTotalPrice;
        const transactionId = (0, uuid_1.v7)();
        const currentTime = new Date().toISOString();
        const combinedTransactionId = `${transactionId}-${currentTime}`;
        const initialDataCreate = await this.prisma.$transaction(async (tx) => {
            const createPayment = await tx.payment.create({
                data: {
                    shopId: initialShopId,
                    amount: mainTotalPrice,
                    txId: combinedTransactionId,
                    userId: tokenUser?.id,
                },
            });
            if (normalProductCalculationResult?.length) {
                const normalProductPromises = normalProductCalculationResult.map((item) => {
                    return tx.paymentAndProduct.create({
                        data: {
                            productId: item?.id,
                            selectQuantity: item?.totalBuyQuantity,
                            payTotalAmount: item?.totalPrice,
                            paymentId: createPayment?.id,
                        },
                    });
                });
                await Promise.all(normalProductPromises);
            }
            if (withPromoProductCalculationResult?.length) {
                const promoProductPromises = withPromoProductCalculationResult.map((item) => {
                    return tx.paymentAndProduct.create({
                        data: {
                            productId: item?.id,
                            selectQuantity: item?.totalBuyQuantity,
                            payTotalAmount: item?.totalPrice,
                            paymentId: createPayment?.id,
                        },
                    });
                });
                await Promise.all(promoProductPromises);
            }
            return createPayment;
        });
        if (!initialDataCreate) {
            throw new common_1.HttpException('Initial Db insert failed', common_1.HttpStatus.CONFLICT);
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
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            type: 'json',
        };
        const { data } = await axios_1.default.post(`${process.env.AAMAR_PAY_HIT_API}`, formData);
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
    async callbackDB(body, query) {
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
                const verifyPaymentData = await (0, verifyPayment_1.verifyPayment)(query?.txnId);
                if (verifyPaymentData && verifyPaymentData?.status_code === '2') {
                    const { approval_code, payment_type, amount, cus_phone, mer_txnid } = verifyPaymentData;
                    const result = await this.prisma.$transaction(async (tx) => {
                        const paymentAndProductIds = paymentInfo?.paymentAndProduct.map((item) => item?.id);
                        const productsUpdateInfo = paymentInfo?.paymentAndProduct.map((item) => ({
                            productId: item?.productId,
                            selectQuantity: item?.selectQuantity,
                        }));
                        const updatePayment = await tx.payment.update({
                            where: {
                                id: paymentInfo?.id,
                            },
                            data: {
                                amount: Number(amount),
                                approval_code: approval_code,
                                payment_type: payment_type,
                                paymentStatus: client_1.PaymentStatus.confirm,
                                mer_txnid: mer_txnid,
                            },
                        });
                        await tx.paymentAndProduct.updateMany({
                            where: {
                                id: {
                                    in: paymentAndProductIds,
                                },
                            },
                            data: {
                                paymentStatus: client_1.PaymentStatus.confirm,
                            },
                        });
                        const productUpdatePromise = productsUpdateInfo?.map(async (item) => {
                            const product = await this.prisma.product.findUnique({
                                where: {
                                    id: item?.productId,
                                },
                            });
                            if (product?.quantity < item?.selectQuantity) {
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
                            if (product?.quantity - item?.selectQuantity ===
                                0) {
                                await tx.product.update({
                                    where: {
                                        id: item?.productId,
                                    },
                                    data: {
                                        quantity: product?.quantity - item?.selectQuantity,
                                        isAvailable: false,
                                        totalBuy: product?.totalBuy + item?.selectQuantity,
                                    },
                                });
                            }
                            else {
                                await tx.product.update({
                                    where: {
                                        id: item?.productId,
                                    },
                                    data: {
                                        quantity: product?.quantity - item?.selectQuantity,
                                        totalBuy: product?.totalBuy + item?.selectQuantity,
                                    },
                                });
                            }
                        });
                        await Promise.all(productUpdatePromise);
                        return updatePayment;
                    });
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
        }
        catch (error) {
            throw new common_1.HttpException('Payment Failed', common_1.HttpStatus.PRECONDITION_FAILED);
        }
    }
    async myAllPaymentInfoDB(tokenUser, queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.payment.findMany({
            where: {
                ...whereConditions,
                userId: tokenUser?.id,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.payment.count({
            where: {
                ...whereConditions,
                userId: tokenUser?.id,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
    async allPaymentInfoDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.payment.findMany({
            where: {
                ...whereConditions,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.payment.count({
            where: {
                ...whereConditions,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
    async shopAllPaymentDB(tokenUser, queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: payment_const_1.paymentInfoSearchAbleFields.map((field) => ({
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
        const result = await this.prisma.payment.findMany({
            where: {
                ...whereConditions,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.payment.count({
            where: {
                ...whereConditions,
                NOT: {
                    paymentStatus: client_1.PaymentStatus.pending,
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
    async adminAndVendorUpdatePaymentDB(paymentId, payload) {
        const paymentInfo = await this.prisma.payment.findUniqueOrThrow({
            where: {
                id: paymentId,
            },
            include: {
                paymentAndProduct: true,
            },
        });
        const paymentAndProductIds = paymentInfo?.paymentAndProduct?.map((item) => item?.id);
        const result = await this.prisma.$transaction(async (tx) => {
            const updatePaymentStatus = await tx.payment.update({
                where: {
                    id: paymentId,
                },
                data: {
                    paymentStatus: payload?.paymentStatus,
                },
            });
            await tx.paymentAndProduct.updateMany({
                where: {
                    id: {
                        in: paymentAndProductIds,
                    },
                },
                data: {
                    paymentStatus: payload?.paymentStatus,
                },
            });
            return updatePaymentStatus;
        });
        return result;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map