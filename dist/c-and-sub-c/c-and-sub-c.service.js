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
exports.CAndSubCService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const formatCategoryName_1 = require("../Common/utils/formatCategoryName");
const paginationHelper_1 = require("../Common/helper/paginationHelper");
const c_and_sub_c_const_1 = require("./c-and-sub-c.const");
let CAndSubCService = class CAndSubCService {
    constructor(prisma) {
        this.prisma = prisma;
        this.updateCategoryDB = async (categoryId, payload) => {
            const { categoryName, ...newPayload } = payload;
            const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
            const isExistCategory = await this.prisma.category.findFirst({
                where: {
                    categoryName: categoryNameFormate,
                    NOT: {
                        id: categoryId,
                    },
                },
            });
            if (isExistCategory) {
                throw new common_1.HttpException('This Category already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const isExistSubCategory = await this.prisma.subCategory.findFirst({
                where: {
                    categoryName: categoryNameFormate,
                },
            });
            if (isExistSubCategory) {
                throw new common_1.HttpException('This SubCategory already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
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
        this.findAllCategoryDB = async (queryObj, options) => {
            const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
            const { searchTerm, ...filterData } = queryObj;
            const andCondition = [];
            if (queryObj.searchTerm) {
                andCondition.push({
                    OR: c_and_sub_c_const_1.categorySearchAbleFields?.map((field) => ({
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
            const result = await this.prisma.category.findMany({
                where: whereConditions,
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
                orderBy: options.sortBy && options.sortOrder
                    ? {
                        [options.sortBy]: options.sortOrder,
                    }
                    : {
                        createdAt: 'desc',
                    },
            });
            const total = await this.prisma.category.count({
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
        };
        this.existFindAllCategoryDB = async () => {
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
        this.singleCategoryBaseFindAllSubCategoryDB = async (categoryId) => {
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
    }
    async createCategoryDB(tokenUser, payload) {
        const { categoryName, ...newPayload } = payload;
        const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
        const isExistCategory = await this.prisma.category.findFirst({
            where: {
                categoryName: categoryNameFormate,
            },
        });
        if (isExistCategory) {
            throw new common_1.HttpException('This Category already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const isExistSubCategory = await this.prisma.subCategory.findFirst({
            where: {
                categoryName: categoryNameFormate,
            },
        });
        if (isExistSubCategory) {
            throw new common_1.HttpException('This SubCategory already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
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
    async createSubCategoryDB(tokenUser, payload) {
        const { categoryName } = payload;
        const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
        const isExistCategory = await this.prisma.category.findFirst({
            where: {
                categoryName: categoryNameFormate,
            },
        });
        if (isExistCategory) {
            throw new common_1.HttpException('This Category already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const isExistSubCategory = await this.prisma.subCategory.findFirst({
            where: {
                categoryName: categoryNameFormate,
            },
        });
        if (isExistSubCategory) {
            throw new common_1.HttpException('This SubCategory already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const isDeleteCategory = await this.prisma.category.findUnique({
            where: {
                id: payload.categoryId,
                isDelete: true,
            },
        });
        if (isDeleteCategory) {
            throw new common_1.HttpException('This C  ategory already Delete', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const result = await this.prisma.subCategory.create({
            data: {
                categoryId: payload.categoryId,
                categoryName: categoryNameFormate,
                adminId: tokenUser?.id,
            },
        });
        return result;
    }
    async updateSubCategoryDB(subCategoryId, payload) {
        const { categoryName, ...others } = payload;
        const categoryNameFormate = (0, formatCategoryName_1.formatCategoryName)(categoryName);
        const isExistCategory = await this.prisma.category.findFirst({
            where: {
                categoryName: categoryNameFormate,
            },
        });
        if (isExistCategory) {
            throw new common_1.HttpException('This Category already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
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
            throw new common_1.HttpException('This SubCategory already exist', common_1.HttpStatus.NOT_ACCEPTABLE);
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
    async findAllSubCategoryDB(queryObj, options) {
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm, ...filterData } = queryObj;
        const andCondition = [];
        if (queryObj.searchTerm) {
            andCondition.push({
                OR: c_and_sub_c_const_1.categorySearchAbleFields.map((field) => ({
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
                        equals: filterData[key],
                    },
                })),
            });
        }
        const whereConditions = { AND: andCondition };
        const result = await this.prisma.subCategory.findMany({
            where: whereConditions,
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
            orderBy: options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: 'desc',
                },
        });
        const total = await this.prisma.subCategory.count({
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
};
exports.CAndSubCService = CAndSubCService;
exports.CAndSubCService = CAndSubCService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CAndSubCService);
//# sourceMappingURL=c-and-sub-c.service.js.map