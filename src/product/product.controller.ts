import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
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
}
