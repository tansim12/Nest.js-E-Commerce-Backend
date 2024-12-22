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
import { ProductService } from './product.service';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import pick from 'src/Common/shared/pick';
import { shopAllProductsFilterAbleFields } from './product.const';
import { ZodValidationPipe } from 'src/Common/pipes/zodValidatiionPipe';
import { productSchema } from './product.zodSchema';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/Common/decorators/role.decorator';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { shopFilterAbleFields } from 'src/shop/shop.const';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // find all product public
  @Get('/')
  async publicAllProducts(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopAllProductsFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.productService.publicAllProductsDB(
        filters,
        options,
      );
      res.send(
        successResponse(result, HttpStatus.OK, 'Find all product public'),
      );
    } catch (error) {
      next(error);
    }
  }

  // create product
  @Post('/')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(productSchema.createProductValidationSchema))
  @Roles(UserRole.vendor)
  async createProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.productService.createProductDB(req?.user, body);
      return res.send(
        successResponse(result, HttpStatus.OK, 'create product '),
      );
    } catch (error) {
      next(error);
    }
  }
  // update product
  @Put('/:productId')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(productSchema.updateProductValidationSchema))
  @Roles(UserRole.vendor, UserRole.admin)
  async updateProductDB(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.productService.updateProductDB(
        req?.user,
        req?.params?.productId,
        body,
      );
      res.send(successResponse(result, HttpStatus.OK, 'Product updated'));
    } catch (error) {
      next(error);
    }
  }
  // findVendorShopAllProductsDB
  @Get('/shop/shop-all-products')
  @UseGuards(AuthGuard)
  @Roles(UserRole.vendor)
  async findVendorShopAllProducts(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.productService.findVendorShopAllProductsDB(
        req?.user,
        filters,
        options,
      );
      res.send(
        successResponse(result, HttpStatus.OK, 'vendor find all product'),
      );
    } catch (error) {
      next(error);
    }
  }
  // adminFindAllProducts
  @Get('/admin/all-products')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async adminFindAllProducts(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.productService.adminFindAllProductsDB(
        filters,
        options,
      );
      res.send(
        successResponse(result, HttpStatus.OK, 'admin find all Products'),
      );
    } catch (error) {
      next(error);
    }
  }
  // publicTopSaleProduct
  @Get('/public/top-sale-products')
  async publicTopSaleProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.productService.publicTopSaleProductDB(
        filters,
        options,
      );
      res.send(
        successResponse(result, HttpStatus.OK, 'find top sale Products'),
      );
    } catch (error) {
      next(error);
    }
  }

  // publicSingleProduct
  @Get('/public/single-product/:productId')
  async publicSingleProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.productService.publicSingleProductDb(
        req?.params?.productId,
      );
      res.send(successResponse(result, HttpStatus.OK, 'Single Product Find '));
    } catch (error) {
      next(error);
    }
  }
  // publicFlashSaleProduct
  @Get('/public/flash-sale/products')
  async publicFlashSaleProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, shopFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.productService.publicFlashSaleProductDB(
        filters,
        options,
      );
      res.send(
        successResponse(result, HttpStatus.OK, 'find flash sale Products'),
      );
    } catch (error) {
      next(error);
    }
  }
  // publicPromoCheck
  @Post('/promo/check')
  async publicPromoCheck(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.productService.publicPromoCheckDB(req?.body);
      res.send(successResponse(result, HttpStatus.OK, 'Promo Check '));
    } catch (error) {
      next(error);
    }
  }
  // publicCompareProduct
  @Post('/compare/compare-products')
  async publicCompareProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.productService.publicCompareProductDB(
        req?.body,
      );
      res.send(successResponse(result, HttpStatus.OK, 'find compare product'));
    } catch (error) {
      next(error);
    }
  }
}
