import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { ZodValidationPipe } from 'src/Common/pipes/zodValidatiionPipe';
import { shopFollowSchema } from './shop.zodSchema';
import { Roles } from 'src/Common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import pick from 'src/Common/shared/pick';
import { shopFilterAbleFields } from './shop.const';

@Controller('api/shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // create shop
  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(shopFollowSchema.shopCreateSchema))
  @Roles(UserRole.admin, UserRole.vendor)
  async createCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.shopService.crateShopDB(req?.user, body);
      return res.send(successResponse(result, HttpStatus.OK, 'create shop '));
    } catch (error) {
      next(error);
    }
  }
  // update shop
  @Put('/:shopId')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(shopFollowSchema.shopUpdateSchema))
  @Roles(UserRole.admin, UserRole.vendor)
  async updateShopInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.shopService.updateShopInfoDB(
        req?.user,
        req?.params?.shopId,
        body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'Shop info update'),
      );
    } catch (error) {
      next(error);
    }
  }
  // find all shop public
  @Get('/')
  async findAllShopPublic(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.shopService.findAllShopPublicDB(
        filters,
        options,
      );
      return res.send(successResponse(result, HttpStatus.OK, 'Find all Shop'));
    } catch (error) {
      next(error);
    }
  }
}
