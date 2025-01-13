import { PaymentService } from './payment.service';
import { NextFunction, Request, Response } from 'express';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    payment(req: Request, res: Response, next: NextFunction): Promise<void>;
    myAllPaymentInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    allPaymentInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    shopAllPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    callback(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminAndVendorUpdatePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
