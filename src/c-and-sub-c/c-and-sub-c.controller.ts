import {
  Body,
  Controller,
  HttpStatus,
  Next,
  Post,
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
  async updateMyProfile(
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
        successResponse(result, HttpStatus.OK, 'create category my profile'),
      );
    } catch (error) {
      next(error);
    }
  }
}
