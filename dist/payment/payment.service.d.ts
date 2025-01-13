import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { IPaginationOptions } from 'src/Common/interface/pagination';
export declare class PaymentService {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    paymentDB(tokenUser: any, body: any): Promise<string | {
        url: any;
    }>;
    callbackDB(body: any, query: any): Promise<{
        success: boolean;
        txnId?: undefined;
    } | {
        success: boolean;
        txnId: any;
    }>;
    myAllPaymentInfoDB(tokenUser: any, queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            productReview: {
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number | null;
                paymentId: string;
                userMessage: string | null;
                shopMessage: string | null;
            }[];
            paymentAndProduct: ({
                product: {
                    productName: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                paymentId: string;
                selectQuantity: number;
                payTotalAmount: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            amount: number;
            mer_txnid: string | null;
            txId: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            payment_type: string | null;
            approval_code: string | null;
        })[];
    }>;
    allPaymentInfoDB(queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            productReview: {
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number | null;
                paymentId: string;
                userMessage: string | null;
                shopMessage: string | null;
            }[];
            paymentAndProduct: ({
                product: {
                    productName: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                paymentId: string;
                selectQuantity: number;
                payTotalAmount: number;
            })[];
            _count: {
                productReview: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            amount: number;
            mer_txnid: string | null;
            txId: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            payment_type: string | null;
            approval_code: string | null;
        })[];
    }>;
    shopAllPaymentDB(tokenUser: any, queryObj: any, options: IPaginationOptions): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        result: ({
            productReview: {
                isDelete: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                rating: number | null;
                paymentId: string;
                userMessage: string | null;
                shopMessage: string | null;
            }[];
            paymentAndProduct: ({
                product: {
                    productName: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                paymentId: string;
                selectQuantity: number;
                payTotalAmount: number;
            })[];
            _count: {
                productReview: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            amount: number;
            mer_txnid: string | null;
            txId: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            payment_type: string | null;
            approval_code: string | null;
        })[];
    }>;
    adminAndVendorUpdatePaymentDB(paymentId: string, payload: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
        amount: number;
        mer_txnid: string | null;
        txId: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        payment_type: string | null;
        approval_code: string | null;
    }>;
}
