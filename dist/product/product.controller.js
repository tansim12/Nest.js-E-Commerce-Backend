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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const pick_1 = require("../Common/shared/pick");
const product_const_1 = require("./product.const");
const zodValidatiionPipe_1 = require("../Common/pipes/zodValidatiionPipe");
const product_zodSchema_1 = require("./product.zodSchema");
const client_1 = require("@prisma/client");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const auth_guard_1 = require("../Common/guard/auth.guard");
const shop_const_1 = require("../shop/shop.const");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async publicAllProducts(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, product_const_1.shopAllProductsFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.publicAllProductsDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find all product public'));
        }
        catch (error) {
            next(error);
        }
    }
    async createProduct(req, res, next, body) {
        try {
            const result = await this.productService.createProductDB(req?.user, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'create product '));
        }
        catch (error) {
            next(error);
        }
    }
    async updateProductDB(req, res, next, body) {
        try {
            const result = await this.productService.updateProductDB(req?.user, req?.params?.productId, body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Product updated'));
        }
        catch (error) {
            next(error);
        }
    }
    async findVendorShopAllProducts(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.findVendorShopAllProductsDB(req?.user, filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'vendor find all product'));
        }
        catch (error) {
            next(error);
        }
    }
    async adminFindAllProducts(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.adminFindAllProductsDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'admin find all Products'));
        }
        catch (error) {
            next(error);
        }
    }
    async publicTopSaleProduct(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.publicTopSaleProductDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find top sale Products'));
        }
        catch (error) {
            next(error);
        }
    }
    async publicSingleProduct(req, res, next) {
        try {
            const result = await this.productService.publicSingleProductDb(req?.params?.productId);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Single Product Find '));
        }
        catch (error) {
            next(error);
        }
    }
    async publicFlashSaleProduct(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.publicFlashSaleProductDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find flash sale Products'));
        }
        catch (error) {
            next(error);
        }
    }
    async publicPromoCheck(req, res, next) {
        try {
            const result = await this.productService.publicPromoCheckDB(req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Promo Check '));
        }
        catch (error) {
            next(error);
        }
    }
    async publicCompareProduct(req, res, next) {
        try {
            const result = await this.productService.publicCompareProductDB(req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find compare product'));
        }
        catch (error) {
            next(error);
        }
    }
    async findRelevantProduct(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, []);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.productService.findRelevantProductDB(req?.body || [], filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find relevant product'));
        }
        catch (error) {
            next(error);
        }
    }
    async productReviewByPayment(req, res, next) {
        try {
            const result = await this.productService.productReviewByPaymentDB(req?.user, req?.params?.paymentId, req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Product review by payment create done'));
        }
        catch (error) {
            next(error);
        }
    }
    async vendorOrShopRepliedReviewsDB(req, res, next) {
        try {
            const result = await this.productService.vendorOrShopRepliedReviewsDB(req?.user, req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Product review by payment create done'));
        }
        catch (error) {
            next(error);
        }
    }
    async findSingleProductAllReviewDB(req, res, next) {
        try {
            const result = await this.productService.findSingleProductAllReviewDB(req?.params?.productId);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Product all review find '));
        }
        catch (error) {
            next(error);
        }
    }
    async vendorFindHisAllProduct(req, res, next) {
        try {
            const result = await this.productService.vendorFindHisAllProductDB(req?.user);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Vendor Find his all product'));
        }
        catch (error) {
            next(error);
        }
    }
    async vendorFindSingleProduct(req, res, next) {
        try {
            const result = await this.productService.vendorFindSingleProductDB(req?.user, req?.params?.productId);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Vendor Find one product'));
        }
        catch (error) {
            next(error);
        }
    }
    async findUserAllReviews(req, res, next) {
        try {
            const result = await this.productService.findUserAllReviewsDB(req?.user);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'User Find his all review'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicAllProducts", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(product_zodSchema_1.productSchema.createProductValidationSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('/:productId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(product_zodSchema_1.productSchema.updateProductValidationSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor, client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProductDB", null);
__decorate([
    (0, common_1.Get)('/shop/shop-all-products'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findVendorShopAllProducts", null);
__decorate([
    (0, common_1.Get)('/admin/all-products'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "adminFindAllProducts", null);
__decorate([
    (0, common_1.Get)('/public/top-sale-products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicTopSaleProduct", null);
__decorate([
    (0, common_1.Get)('/public/single-product/:productId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicSingleProduct", null);
__decorate([
    (0, common_1.Get)('/public/flash-sale/products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicFlashSaleProduct", null);
__decorate([
    (0, common_1.Post)('/promo/check'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicPromoCheck", null);
__decorate([
    (0, common_1.Post)('/compare/compare-products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "publicCompareProduct", null);
__decorate([
    (0, common_1.Post)('/relevant/relevant-products'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findRelevantProduct", null);
__decorate([
    (0, common_1.Put)('/payment/review/:paymentId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.user, client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "productReviewByPayment", null);
__decorate([
    (0, common_1.Post)('/payment/review-replied'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "vendorOrShopRepliedReviewsDB", null);
__decorate([
    (0, common_1.Get)('/public/payment/review-info/:productId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findSingleProductAllReviewDB", null);
__decorate([
    (0, common_1.Get)('/vendor/find-his-all-product'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "vendorFindHisAllProduct", null);
__decorate([
    (0, common_1.Get)('/vendor/find-one-product/:productId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "vendorFindSingleProduct", null);
__decorate([
    (0, common_1.Get)('/user/find-his-review'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor, client_1.UserRole.user, client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findUserAllReviews", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('api/product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map