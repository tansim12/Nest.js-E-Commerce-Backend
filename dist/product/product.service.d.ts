import { IPaginationOptions } from 'src/Common/interface/pagination';
import { PrismaService } from 'src/prisma.service';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProductDB(tokenUser: any, payload: any): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        description: string;
        averageRating: number;
        productName: string;
        quantity: number;
        isAvailable: boolean;
        totalBuy: number;
        price: number;
        discount: number | null;
        promo: string | null;
        isActivePromo: boolean;
        isFlashSaleOffer: boolean;
        flashSaleDiscount: number | null;
        flashSaleStartDate: Date | null;
        flashSaleEndDate: Date | null;
        totalSubmitRating: number;
        totalUserGiveRating: number;
        images: string[];
        categoryId: string;
        subCategoryId: string | null;
    }>;
    updateProductDB(tokenUser: any, productId: string, payload: any): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        description: string;
        averageRating: number;
        productName: string;
        quantity: number;
        isAvailable: boolean;
        totalBuy: number;
        price: number;
        discount: number | null;
        promo: string | null;
        isActivePromo: boolean;
        isFlashSaleOffer: boolean;
        flashSaleDiscount: number | null;
        flashSaleStartDate: Date | null;
        flashSaleEndDate: Date | null;
        totalSubmitRating: number;
        totalUserGiveRating: number;
        images: string[];
        categoryId: string;
        subCategoryId: string | null;
    }>;
    findVendorShopAllProductsDB(tokenUser: any, queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
            product: ({
                category: {
                    id: string;
                    categoryName: string;
                };
                subCategory: {
                    id: string;
                    categoryName: string;
                };
            } & {
                id: string;
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                shopId: string;
                description: string;
                averageRating: number;
                productName: string;
                quantity: number;
                isAvailable: boolean;
                totalBuy: number;
                price: number;
                discount: number | null;
                promo: string | null;
                isActivePromo: boolean;
                isFlashSaleOffer: boolean;
                flashSaleDiscount: number | null;
                flashSaleStartDate: Date | null;
                flashSaleEndDate: Date | null;
                totalSubmitRating: number;
                totalUserGiveRating: number;
                images: string[];
                categoryId: string;
                subCategoryId: string | null;
            })[];
        } & {
            id: string;
            name: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            contactNumber: string | null;
            vendorId: string;
            description: string | null;
            averageRating: number;
            logo: string | null;
            shopType: string | null;
            address: string | null;
            isBlocked: boolean;
        };
    }>;
    adminFindAllProductsDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            shop: {
                id: string;
                name: string;
                logo: string;
            };
            category: {
                id: string;
                categoryName: string;
            };
            subCategory: {
                id: string;
                categoryName: string;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        })[];
    }>;
    publicTopSaleProductDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            shop: {
                id: string;
                name: string;
                logo: string;
            };
            category: {
                id: string;
                categoryName: string;
            };
            subCategory: {
                id: string;
                categoryName: string;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        })[];
    }>;
    publicSingleProductDb(productId: string): Promise<{
        result: {
            shop: {
                id: string;
                name: string;
                _count: {
                    vendor: number;
                    shopReview: number;
                    shopFollow: number;
                    product: number;
                    payment: number;
                };
                logo: string;
                shopType: string;
            };
            category: {
                id: string;
                categoryName: string;
            };
            subCategory: {
                id: string;
                categoryName: string;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        };
        relatedProduct: {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        }[];
    }>;
    publicFlashSaleProductDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        }[];
    }>;
    publicPromoCheckDB(payload: any): Promise<{
        status: number;
        message: string;
        newUnitPrice?: undefined;
        id?: undefined;
    } | {
        status: number;
        message: string;
        newUnitPrice: number;
        id: string;
    }>;
    publicAllProductsDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            category: {
                id: string;
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryName: string;
                adminId: string;
            };
            subCategory: {
                id: string;
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string;
                categoryName: string;
                adminId: string;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        })[];
    }>;
    publicCompareProductDB: (productIds: string[]) => Promise<({
        category: {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryName: string;
            adminId: string;
        };
    } & {
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        description: string;
        averageRating: number;
        productName: string;
        quantity: number;
        isAvailable: boolean;
        totalBuy: number;
        price: number;
        discount: number | null;
        promo: string | null;
        isActivePromo: boolean;
        isFlashSaleOffer: boolean;
        flashSaleDiscount: number | null;
        flashSaleStartDate: Date | null;
        flashSaleEndDate: Date | null;
        totalSubmitRating: number;
        totalUserGiveRating: number;
        images: string[];
        categoryId: string;
        subCategoryId: string | null;
    })[]>;
    findRelevantProductDB(categoryIds: string[], queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            description: string;
            averageRating: number;
            productName: string;
            quantity: number;
            isAvailable: boolean;
            totalBuy: number;
            price: number;
            discount: number | null;
            promo: string | null;
            isActivePromo: boolean;
            isFlashSaleOffer: boolean;
            flashSaleDiscount: number | null;
            flashSaleStartDate: Date | null;
            flashSaleEndDate: Date | null;
            totalSubmitRating: number;
            totalUserGiveRating: number;
            images: string[];
            categoryId: string;
            subCategoryId: string | null;
        }[];
    }>;
    productReviewByPaymentDB(tokenUser: any, paymentId: string, payload: any): Promise<{
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number | null;
        paymentId: string;
        userMessage: string | null;
        shopMessage: string | null;
    }>;
    vendorOrShopRepliedReviewsDB(tokenUser: any, payload: any): Promise<{
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number | null;
        paymentId: string;
        userMessage: string | null;
        shopMessage: string | null;
    }>;
    findSingleProductAllReviewDB: (productId: string) => Promise<({
        user: {
            userProfile: {
                profilePhoto: string;
            }[];
            name: string;
        };
    } & {
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number | null;
        paymentId: string;
        userMessage: string | null;
        shopMessage: string | null;
    })[]>;
    vendorFindHisAllProductDB(tokenUser: any): Promise<{
        id: string;
        productName: string;
    }[]>;
    vendorFindSingleProductDB(tokenUser: any, productId: string): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        description: string;
        averageRating: number;
        productName: string;
        quantity: number;
        isAvailable: boolean;
        totalBuy: number;
        price: number;
        discount: number | null;
        promo: string | null;
        isActivePromo: boolean;
        isFlashSaleOffer: boolean;
        flashSaleDiscount: number | null;
        flashSaleStartDate: Date | null;
        flashSaleEndDate: Date | null;
        totalSubmitRating: number;
        totalUserGiveRating: number;
        images: string[];
        categoryId: string;
        subCategoryId: string | null;
    }>;
    findUserAllReviewsDB(tokenUser: any): Promise<({
        payment: {
            paymentAndProduct: {
                product: {
                    productName: string;
                    images: string[];
                };
            }[];
        };
    } & {
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        rating: number | null;
        paymentId: string;
        userMessage: string | null;
        shopMessage: string | null;
    })[]>;
}
