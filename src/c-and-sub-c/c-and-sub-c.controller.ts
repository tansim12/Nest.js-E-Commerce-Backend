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
import { CAndSubCService } from './c-and-sub-c.service';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/Common/decorators/role.decorator';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { ZodValidationPipe } from 'src/Common/pipes/zodValidatiionPipe';
import { categoryAndSubCategorySchema } from './c-and-sub-c.zodSchema';
import pick from 'src/Common/shared/pick';
import { categoryFilterAbleFields } from './c-and-sub-c.const';

@Controller('api/cAndSubC')
export class CAndSubCController {
  constructor(private readonly cAndSubCService: CAndSubCService) {}

  // create category
  @Post('/create-category')
  @UseGuards(AuthGuard)
  @UsePipes(
    new ZodValidationPipe(categoryAndSubCategorySchema.createCategorySchema),
  )
  @Roles(UserRole.admin)
  async createCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.cAndSubCService.createCategoryDB(
        req?.user,
        body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'create category '),
      );
    } catch (error) {
      next(error);
    }
  }

  // update category
  @Put('/update-category/:categoryId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  @UsePipes(
    new ZodValidationPipe(categoryAndSubCategorySchema.updateCategorySchema),
  )
  async updateCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.cAndSubCService.updateCategoryDB(
        req?.params?.categoryId,
        body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'update category '),
      );
    } catch (error) {
      next(error);
    }
  }
  // create sub-category
  @Post('/create-sub-category')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  @UsePipes(
    new ZodValidationPipe(categoryAndSubCategorySchema.createSubCategorySchema),
  )
  async createSubCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.cAndSubCService.createSubCategoryDB(
        req?.user,
        body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'create sub-category '),
      );
    } catch (error) {
      next(error);
    }
  }

  // update sub category
  @Put('/update-sub-category/:subCategoryId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  @UsePipes(
    new ZodValidationPipe(categoryAndSubCategorySchema.updateSubCategorySchema),
  )
  async updateSubCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
  ) {
    try {
      const result = await this.cAndSubCService.updateSubCategoryDB(
        req?.params?.subCategoryId,
        body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'update sub category '),
      );
    } catch (error) {
      next(error);
    }
  }
  // all category find
  @Get('/category')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async findAllCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, categoryFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.cAndSubCService.findAllCategoryDB(
        filters,
        options,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'find all category '),
      );
    } catch (error) {
      next(error);
    }
  }
  // find all sub category
  @Get('/sub-category')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async findAllSubCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, categoryFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.cAndSubCService.findAllSubCategoryDB(
        filters,
        options,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'find all sub category '),
      );
    } catch (error) {
      next(error);
    }
  }

  // exist all  category
  @Get('/category/admin/allCategory')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor)
  async existFindAllCategory(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.cAndSubCService.existFindAllCategoryDB();
      return res.send(
        successResponse(result, HttpStatus.OK, 'find all exist category '),
      );
    } catch (error) {
      next(error);
    }
  }
  // singleCategoryBaseFindAllSubCategory
  @Get('/category/categoryBaseSubCategory/:categoryId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor)
  async singleCategoryBaseFindAllSubCategory(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result =
        await this.cAndSubCService.singleCategoryBaseFindAllSubCategoryDB(
          req?.params?.categoryId,
        );
      return res.send(
        successResponse(
          result,
          HttpStatus.OK,
          'Category base find all sub category just name and id send',
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  // publicFindAllCategoryWithSubCategory
  @Get('/')
  async publicFindAllCategoryWithSubCategory(
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result =
        await this.cAndSubCService.publicFindAllCategoryWithSubCategoryDB();
      return res.send(
        successResponse(
          result,
          HttpStatus.OK,
          'All Category and sub category find ',
        ),
      );
    } catch (error) {
      next(error);
    }
  }
}
