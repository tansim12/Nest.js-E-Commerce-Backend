"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const client_1 = require("@prisma/client");
const auth_guard_1 = require("../Common/guard/auth.guard");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const pick_1 = require("../Common/shared/pick");
const payment_const_1 = require("./payment.const");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async payment(req, res, next) {
        try {
            const result = await this.paymentService.paymentDB(req.user, req.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Payment ongoing ...'));
        }
        catch (error) {
            next(error);
        }
    }
    async myAllPaymentInfo(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, payment_const_1.paymentInfoFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.paymentService.myAllPaymentInfoDB(req?.user, filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all user'));
        }
        catch (error) {
            next(error);
        }
    }
    async allPaymentInfo(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, payment_const_1.paymentInfoFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.paymentService.allPaymentInfoDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all payment'));
        }
        catch (error) {
            next(error);
        }
    }
    async shopAllPayment(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, payment_const_1.paymentInfoFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.paymentService.shopAllPaymentDB(req?.user, filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all shop payment'));
        }
        catch (error) {
            next(error);
        }
    }
    async callback(req, res, next) {
        try {
            const result = await this.paymentService.callbackDB(req.body, req?.query);
            if (result?.success) {
                res.redirect(`${process.env.FRONTEND_URL}/payment-success?bookingId=${result?.txnId}`);
            }
            if (result?.success === false) {
                res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
            }
        }
        catch (error) {
            next(error);
        }
    }
    async adminAndVendorUpdatePayment(req, res, next) {
        try {
            const result = await this.paymentService.adminAndVendorUpdatePaymentDB(req?.params?.paymentId, req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'update payment'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole?.admin, client_1.UserRole.user, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "payment", null);
__decorate([
    (0, common_1.Get)('/my-payment-info'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole?.admin, client_1.UserRole.user, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "myAllPaymentInfo", null);
__decorate([
    (0, common_1.Get)('/all-payment-info'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole?.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "allPaymentInfo", null);
__decorate([
    (0, common_1.Get)('/shop-all-payment-info'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "shopAllPayment", null);
__decorate([
    (0, common_1.Post)('/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "callback", null);
__decorate([
    (0, common_1.Put)('/payment-update/:paymentId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor, client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "adminAndVendorUpdatePayment", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('api/payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map