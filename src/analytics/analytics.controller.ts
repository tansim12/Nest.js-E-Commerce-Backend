import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/Common/decorators/role.decorator';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // adminAnalytics
  @Get('/admin')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async adminAnalytics(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.analyticsService.adminAnalyticsDB();
      res.send(successResponse(result, HttpStatus.OK, 'Find admin analytics'));
    } catch (error) {
      next(error);
    }
  }
  // shopAnalytics
  @Get('/shop')
  @UseGuards(AuthGuard)
  @Roles(UserRole.vendor)
  async shopAnalytics(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.analyticsService.shopAnalyticsDB(req?.user);
      res.send(successResponse(result, HttpStatus.OK, 'shop analytics'));
    } catch (error) {
      next(error);
    }
  }
}
