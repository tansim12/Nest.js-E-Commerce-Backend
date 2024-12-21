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
  // find single shop public
  @Get('/:shopId')
  async findSingleShopPublic(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, []);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.shopService.findSingleShopPublicDB(
        req?.params?.shopId,
        filters,
        options,
      );
      return res.send(
        successResponse(
          result,
          HttpStatus.OK,
          'Single Shop find successfully done',
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  //  shop following
  @Post('/user/shop-following')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(shopFollowSchema.createShopFollowSchema))
  @Roles(UserRole.admin, UserRole.user, UserRole.vendor)
  async shopFollowing(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.shopService.shopFollowingDB(req?.user, body);
      return res.send(
        successResponse(
          result,
          HttpStatus.OK,
          'Shop Following successfully done',
        ),
      );
    } catch (error) {
      next(error);
    }
  }
  //  findSingleUserFollowDB following
  @Get('/user/shop-following/:shopId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.user, UserRole.vendor)
  async findSingleUserFollow(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.shopService.findSingleUserFollowDB(
        req?.user,
        req?.params?.shopId,
      );
      res.send(successResponse(result, HttpStatus.OK, 'Find user follow'));
    } catch (error) {
      next(error);
    }
  }
  //  shopReview
  @Put('/user/shop-review')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(shopFollowSchema.createShopReviewSchema))
  @Roles(UserRole.admin, UserRole.user, UserRole.vendor)
  async shopReview(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.shopService.shopReviewDB(req?.user, body);
      res.send(
        successResponse(result, HttpStatus.OK, 'Shop review successfully done'),
      );
    } catch (error) {
      next(error);
    }
  }
  // vendorFindHisShopDB
  @Get('/vendor/vendor-my-shop')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor)
  async vendorFindHisShop(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.shopService.vendorFindHisShopDB(req?.user);
      res.send(successResponse(result, HttpStatus.OK, 'Vendor Find his shop'));
    } catch (error) {
      next(error);
    }
  }
}
