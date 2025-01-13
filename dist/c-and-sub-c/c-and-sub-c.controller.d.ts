import { CAndSubCService } from './c-and-sub-c.service';
import { NextFunction, Request, Response } from 'express';
export declare class CAndSubCController {
    private readonly cAndSubCService;
    constructor(cAndSubCService: CAndSubCService);
    createCategory(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    updateCategory(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    createSubCategory(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    updateSubCategory(req: Request, res: Response, next: NextFunction, body: any): Promise<Response<any, Record<string, any>>>;
    findAllCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    findAllSubCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    existFindAllCategory(res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    singleCategoryBaseFindAllSubCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    publicFindAllCategoryWithSubCategory(res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
