import {
  Controller,
  Get,
  Req,
  UseGuards,
  Res,
  Next,
  HttpStatus,
  Put,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { Roles } from 'src/Common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import {
  userFilterAbleFields,
  userWishListFilterAbleFields,
} from './user.const';
import pick from 'src/Common/shared/pick';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async getAllUsers(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, userFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.userService.getAllUsersDB(filters, options);
      return res.send(successResponse(result, HttpStatus.OK, 'Find All User'));
    } catch (error) {
      next(error);
    }
  }

  // admin update user
  @Put('/admin-update-user/:userId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin)
  async adminUpdateUser(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.adminUpdateUserDB(
        req?.params?.userId,
        req?.body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'admin update profile'),
      );
    } catch (error) {
      next(error);
    }
  }
  // find my profile
  @Get('/find/my-profile')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor, UserRole.user)
  async findMyProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.findMyProfileDB(req?.user);
      return res.send(
        successResponse(result, HttpStatus.OK, 'Find my profile'),
      );
    } catch (error) {
      next(error);
    }
  }
  // update my profile
  @Put('/update-my-profile')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor, UserRole.user)
  async updateMyProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.updateMyProfileDB(
        req?.user,
        req?.body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'update my profile'),
      );
    } catch (error) {
      next(error);
    }
  }
  // get single user
  @Get('/:userId')
  async getSingleUser(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.getSingleUserDB(req.params?.userId);
      return res.send(
        successResponse(result, HttpStatus.OK, 'update my profile'),
      );
    } catch (error) {
      next(error);
    }
  }

  // createWishlist
  @Post('/wishList')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor, UserRole.user)
  async createWishlist(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.userService.createWishlistDB(
        req?.user,
        req?.body,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'wish list create'),
      );
    } catch (error) {
      next(error);
    }
  }

  // findUserAllWishList
  @Get('/wishList/all')
  @UseGuards(AuthGuard)
  @Roles(UserRole.admin, UserRole.vendor, UserRole.user)
  async findUserAllWishList(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, userWishListFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.userService.findUserAllWishListDB(
        filters,
        options,
        req?.user,
      );
      return res.send(
        successResponse(result, HttpStatus.OK, 'Find All User wishlist'),
      );
    } catch (error) {
      next(error);
    }
  }
}
