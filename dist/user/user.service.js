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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const paginationHelper_1 = require("../Common/helper/paginationHelper");
const user_const_1 = require("./user.const");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsersDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: user_const_1.userSearchAbleFields.map((field) => ({
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
            orderBy: options.sortBy && options.sortOrder
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
    async adminUpdateUserDB(userId, payload) {
        if (payload?.email || payload.password) {
            throw new common_1.HttpException("You Can't change email or password", common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const userInfo = await tx.user.update({
                where: {
                    id: userId,
                },
                data: payload,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isDelete: true,
                    role: true,
                    status: true,
                    updatedAt: true,
                },
            });
            await tx.userProfile.update({
                where: {
                    email: userInfo.email,
                },
                data: {
                    status: payload?.status,
                },
            });
            return userInfo;
        });
        return result;
    }
    async findMyProfileDB(tokenUser) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: tokenUser?.email,
                isDelete: false,
                status: client_1.UserStatus.active,
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                isDelete: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                userProfile: true,
                shopFollow: {
                    select: {
                        shop: {
                            select: {
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
        return user;
    }
    async updateMyProfileDB(tokenUser, body) {
        const { name, ...payload } = body;
        const user = await this.prisma.user.findUniqueOrThrow({
            where: {
                email: tokenUser.email,
                isDelete: false,
                status: client_1.UserStatus.active,
            },
        });
        if (body.status || body.role) {
            throw new common_1.HttpException("You can't change role and status", common_1.HttpStatus.BAD_REQUEST);
        }
        if (name) {
            await this.prisma.user.update({
                where: { email: user.email },
                data: {
                    name,
                },
            });
        }
        const userProfile = await this.prisma.userProfile.update({
            where: { email: user.email },
            data: payload,
        });
        return userProfile;
    }
    async getSingleUserDB(paramsId) {
        const result = await this.prisma.user.findUniqueOrThrow({
            where: {
                id: paramsId,
                isDelete: false,
                status: client_1.UserStatus.active,
            },
            select: {
                email: true,
                id: true,
                role: true,
                name: true,
                isDelete: true,
                createdAt: true,
                lastPasswordChange: true,
                status: true,
                updatedAt: true,
                userProfile: true,
            },
        });
        return result;
    }
    async createWishlistDB(tokenUser, payload) {
        const result = await this.prisma.wishlist.create({
            data: {
                userId: tokenUser?.id,
                productId: payload?.productId,
            },
        });
        return result;
    }
    async findUserAllWishListDB(queryObj, options, tokenUser) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: user_const_1.userWishListSearchAbleFields?.map((field) => ({
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
        const result = await this.prisma.wishlist.findMany({
            where: {
                ...whereConditions,
                userId: tokenUser?.id,
            },
            select: {
                id: true,
                product: true,
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
        const total = await this.prisma.wishlist.count({
            where: {
                ...whereConditions,
                userId: tokenUser?.id,
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
    async singleDeleteWishListProductDB(tokenUser, wishListId) {
        const result = await this.prisma.wishlist.delete({
            where: {
                userId: tokenUser?.id,
                id: wishListId,
            },
        });
        return result;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map