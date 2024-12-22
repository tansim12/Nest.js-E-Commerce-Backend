import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from 'src/Common/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AuthGuard } from 'src/Common/guard/auth.guard';
import { successResponse } from 'src/Common/Re-useable/successResponse';
import pick from 'src/Common/shared/pick';
import { paymentInfoFilterAbleFields } from './payment.const';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  // create payment
  @Post('/')
  @UseGuards(AuthGuard)
  @Roles(UserRole?.admin, UserRole.user, UserRole.vendor)
  async payment(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.paymentService.paymentDB(req.user, req.body);
      res.send(successResponse(result, HttpStatus.OK, 'Payment ongoing ...'));
    } catch (error) {
      next(error);
    }
  }
  // myAllPaymentInfo
  @Get('/my-payment-info')
  @UseGuards(AuthGuard)
  @Roles(UserRole?.admin, UserRole.user, UserRole.vendor)
  async myAllPaymentInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, paymentInfoFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.paymentService.myAllPaymentInfoDB(
        req?.user,
        filters,
        options,
      );
      res.send(successResponse(result, HttpStatus.OK, 'find all user'));
    } catch (error) {
      next(error);
    }
  }
  // allPaymentInfo
  @Get('/all-payment-info')
  @UseGuards(AuthGuard)
  @Roles(UserRole?.admin, UserRole.vendor)
  async allPaymentInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, paymentInfoFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.paymentService.allPaymentInfoDB(
        filters,
        options,
      );
      res.send(successResponse(result, HttpStatus.OK, 'find all payment'));
    } catch (error) {
      next(error);
    }
  }
  // shopAllPayment
  @Get('/shop-all-payment-info')
  @UseGuards(AuthGuard)
  @Roles(UserRole.vendor)
  async shopAllPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const filters = pick(req.query, paymentInfoFilterAbleFields);
      const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
      const result = await this.paymentService.shopAllPaymentDB(
        req?.user,
        filters,
        options,
      );
      res.send(successResponse(result, HttpStatus.OK, 'find all shop payment'));
    } catch (error) {
      next(error);
    }
  }
  // callback
  @Post('/callback')
  async callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result: any = await this.paymentService.callbackDB(
        req.body,
        req?.query,
      );
      if (result?.success) {
        res.redirect(
          // `${process.env.FRONTEND_URL}payment-success?bookingId=${result?.bookingId}`
          //! todo should be dynamic transaction id
          `${process.env.FRONTEND_URL}/payment-success?bookingId=${result?.txnId}`,
        );
      }
      if (result?.success === false) {
        res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }
    } catch (error) {
      next(error);
    }
  }

  // adminAndVendorUpdatePayment
  @Put('/payment-update/:paymentId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.vendor, UserRole.admin)
  async adminAndVendorUpdatePayment(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.paymentService.adminAndVendorUpdatePaymentDB(
        req?.params?.paymentId,
        req?.body,
      );
      res.send(successResponse(result, HttpStatus.OK, 'update payment'));
    } catch (error) {
      next(error);
    }
  }
}
