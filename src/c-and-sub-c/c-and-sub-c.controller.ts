import {
  Controller,
  HttpStatus,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CAndSubCService } from './c-and-sub-c.service';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/Common/decorators/role.decorator';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import { AuthGuard } from 'src/Common/guard/auth.guard';

@Controller('api/cAndSubC')
export class CAndSubCController {
  constructor(private readonly cAndSubCService: CAndSubCService) {}

  // create category
  @Post('/create-category')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async updateMyProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.cAndSubCService.createCategoryDB(
        req?.user,
        req?.body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'create category my profile'),
      );
    } catch (error) {
      next(error);
    }
  }
}
