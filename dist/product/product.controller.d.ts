import { ProductService } from './product.service';
import { NextFunction, Request, Response } from 'express';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    publicAllProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    createProduct(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    updateProductDB(req: Request, res: Response, next: NextFunction, body: any): Promise<void>;
    findVendorShopAllProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminFindAllProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    publicTopSaleProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    publicSingleProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    publicFlashSaleProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    publicPromoCheck(req: Request, res: Response, next: NextFunction): Promise<void>;
    publicCompareProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    findRelevantProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    productReviewByPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    vendorOrShopRepliedReviewsDB(req: Request, res: Response, next: NextFunction): Promise<void>;
    findSingleProductAllReviewDB(req: Request, res: Response, next: NextFunction): Promise<void>;
    vendorFindHisAllProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    vendorFindSingleProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    findUserAllReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
}
