import { AnalyticsService } from './analytics.service';
import { NextFunction, Request, Response } from 'express';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    adminAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    shopAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
    createNewsletter(req: Request, res: Response, next: NextFunction): Promise<void>;
    findAllNewsLetterEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    newsletterGroupMessageSend(req: Request, res: Response, next: NextFunction): Promise<void>;
}
