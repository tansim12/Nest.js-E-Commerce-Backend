import { UserService } from './user.service';
import { NextFunction, Request, Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    adminUpdateUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    findMyProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    getSingleUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    createWishlist(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    findUserAllWishList(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    singleDeleteWishListProduct(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
