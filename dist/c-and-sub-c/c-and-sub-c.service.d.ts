import { PrismaService } from 'src/prisma.service';
import { TCategory } from './c-and-sub-c.interface';
import { IPaginationOptions } from 'src/Common/interface/pagination';
export declare class CAndSubCService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCategoryDB(tokenUser: any, payload: TCategory): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryName: string;
        adminId: string;
    }>;
    updateCategoryDB: (categoryId: any, payload: TCategory) => Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryName: string;
        adminId: string;
    }>;
    createSubCategoryDB(tokenUser: any, payload: TCategory): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        categoryName: string;
        adminId: string;
    }>;
    updateSubCategoryDB(subCategoryId: string, payload: TCategory): Promise<{
        id: string;
        isDelete: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        categoryName: string;
        adminId: string;
    }>;
    findAllCategoryDB: (queryObj: any, options: IPaginationOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            admin: {
                id: string;
                name: string;
                email: string;
                status: import(".prisma/client").$Enums.UserStatus;
                isDelete: boolean;
                role: import(".prisma/client").$Enums.UserRole;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryName: string;
            adminId: string;
        })[];
    }>;
    findAllSubCategoryDB(queryObj: any, options: IPaginationOptions): Promise<{
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
            admin: {
                id: string;
                name: string;
                email: string;
                status: import(".prisma/client").$Enums.UserStatus;
                isDelete: boolean;
                role: import(".prisma/client").$Enums.UserRole;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            isDelete: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            categoryName: string;
            adminId: string;
        })[];
    }>;
    existFindAllCategoryDB: () => Promise<{
        id: string;
        categoryName: string;
    }[]>;
    singleCategoryBaseFindAllSubCategoryDB: (categoryId: string) => Promise<{
        id: string;
        categoryName: string;
    }[]>;
    publicFindAllCategoryWithSubCategoryDB(): Promise<{
        subCategory: {
            id: string;
            categoryName: string;
        }[];
        id: string;
        categoryName: string;
    }[]>;
}
