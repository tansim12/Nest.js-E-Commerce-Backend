import { ShopService } from './shop.service';
import { NextFunction, Request, Response } from 'express';
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    createCategory(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    updateShopInfo(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    findAllShopPublic(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    findSingleShopPublic(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    shopFollowing(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    findSingleUserFollow(req: Request, res: Response, next: NextFunction): Promise<void>;
    shopReview(req: Request, res: Response, next: NextFunction, body: any): Promise<void>;
    vendorFindHisShop(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminFindAllShop(req: Request, res: Response, next: NextFunction): Promise<void>;
    isShopExist(req: Request, res: Response, next: NextFunction): Promise<void>;
}
