import { IPaginationOptions } from 'src/Common/interface/pagination';
import { PrismaService } from 'src/prisma.service';
export declare class ShopService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crateShopDB(tokenUser: any, payload: any): Promise<{
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
    }>;
    findSingleShopPublicDB(shopId: string, queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
            shopReview: {
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                shopId: string;
                details: string;
                rating: number | null;
            }[];
            product: {
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
            _count: {
                shopFollow: number;
                product: number;
            };
            vendor: {
                userProfile: {
                    profilePhoto: string;
                }[];
                name: string;
                email: string;
            };
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
    findAllShopPublicDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
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
        }[];
    }>;
    shopFollowingDB(tokenUser: any, payload: any): Promise<{
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
    }>;
    shopReviewDB(tokenUser: any, payload: any): Promise<{
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
        details: string;
        rating: number | null;
    }>;
    vendorFindHisShopDB(tokenUser: any): Promise<{
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
    }>;
    updateShopInfoDB(tokenUser: any, shopId: string, payload: any): Promise<{
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
    }>;
    adminFindAllShopDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
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
        }[];
    }>;
    findSingleUserFollowDB(tokenUser: any, shopId: string): Promise<{
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
    } | {
        status: number;
        message: string;
    }>;
    isShopExistDb(tokenUser: any): Promise<{
        status: number;
        message: string;
    }>;
}
