import { PrismaService } from 'src/prisma.service';
import { IPaginationOptions } from 'src/Common/interface/pagination';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllUsersDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
            userProfile: {
                id: string;
                email: string;
                status: import(".prisma/client").$Enums.UserStatus;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                profilePhoto: string | null;
                coverPhoto: string | null;
                bio: string | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                contactNumber: string | null;
            }[];
            id: string;
            name: string;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            isDelete: boolean;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    adminUpdateUserDB(userId: string, payload: any): Promise<{
        id: string;
        name: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        isDelete: boolean;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    findMyProfileDB(tokenUser: any): Promise<{
        userProfile: {
            id: string;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePhoto: string | null;
            coverPhoto: string | null;
            bio: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            contactNumber: string | null;
        }[];
        shopFollow: {
            shop: {
                name: string;
                logo: string;
            };
        }[];
        id: string;
        name: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        isDelete: boolean;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMyProfileDB(tokenUser: any, body: any): Promise<{
        id: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        profilePhoto: string | null;
        coverPhoto: string | null;
        bio: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        contactNumber: string | null;
    }>;
    getSingleUserDB(paramsId: string): Promise<{
        userProfile: {
            id: string;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePhoto: string | null;
            coverPhoto: string | null;
            bio: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            contactNumber: string | null;
        }[];
        id: string;
        name: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        isDelete: boolean;
        role: import(".prisma/client").$Enums.UserRole;
        lastPasswordChange: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createWishlistDB(tokenUser: any, payload: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    findUserAllWishListDB(queryObj: any, options: IPaginationOptions, tokenUser: any): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: {
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
            };
            id: string;
        }[];
    }>;
    singleDeleteWishListProductDB(tokenUser: any, wishListId: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
}
