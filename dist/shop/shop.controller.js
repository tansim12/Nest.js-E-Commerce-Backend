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
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const shop_service_1 = require("./shop.service");
const auth_guard_1 = require("../Common/guard/auth.guard");
const zodValidatiionPipe_1 = require("../Common/pipes/zodValidatiionPipe");
const shop_zodSchema_1 = require("./shop.zodSchema");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const client_1 = require("@prisma/client");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const pick_1 = require("../Common/shared/pick");
const shop_const_1 = require("./shop.const");
let ShopController = class ShopController {
    constructor(shopService) {
        this.shopService = shopService;
    }
    async createCategory(req, res, next, body) {
        try {
            const result = await this.shopService.crateShopDB(req?.user, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'create shop '));
        }
        catch (error) {
            next(error);
        }
    }
    async updateShopInfo(req, res, next, body) {
        try {
            const result = await this.shopService.updateShopInfoDB(req?.user, req?.params?.shopId, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Shop info update'));
        }
        catch (error) {
            next(error);
        }
    }
    async findAllShopPublic(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.shopService.findAllShopPublicDB(filters, options);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find all Shop'));
        }
        catch (error) {
            next(error);
        }
    }
    async findSingleShopPublic(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, []);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.shopService.findSingleShopPublicDB(req?.params?.shopId, filters, options);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Single Shop find successfully done'));
        }
        catch (error) {
            next(error);
        }
    }
    async shopFollowing(req, res, next, body) {
        try {
            const result = await this.shopService.shopFollowingDB(req?.user, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Shop Following successfully done'));
        }
        catch (error) {
            next(error);
        }
    }
    async findSingleUserFollow(req, res, next) {
        try {
            const result = await this.shopService.findSingleUserFollowDB(req?.user, req?.params?.shopId);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find user follow'));
        }
        catch (error) {
            next(error);
        }
    }
    async shopReview(req, res, next, body) {
        try {
            const result = await this.shopService.shopReviewDB(req?.user, body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Shop review successfully done'));
        }
        catch (error) {
            next(error);
        }
    }
    async vendorFindHisShop(req, res, next) {
        try {
            const result = await this.shopService.vendorFindHisShopDB(req?.user);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Vendor Find his shop'));
        }
        catch (error) {
            next(error);
        }
    }
    async adminFindAllShop(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, shop_const_1.shopFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.shopService.adminFindAllShopDB(filters, options);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find all Shop'));
        }
        catch (error) {
            next(error);
        }
    }
    async isShopExist(req, res, next) {
        try {
            const result = await this.shopService.isShopExistDb(req?.user);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find shop'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(shop_zodSchema_1.shopFollowSchema.shopCreateSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('/:shopId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(shop_zodSchema_1.shopFollowSchema.shopUpdateSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "updateShopInfo", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "findAllShopPublic", null);
__decorate([
    (0, common_1.Get)('/:shopId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "findSingleShopPublic", null);
__decorate([
    (0, common_1.Post)('/user/shop-following'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(shop_zodSchema_1.shopFollowSchema.createShopFollowSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "shopFollowing", null);
__decorate([
    (0, common_1.Get)('/user/shop-following/:shopId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "findSingleUserFollow", null);
__decorate([
    (0, common_1.Put)('/user/shop-review'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(shop_zodSchema_1.shopFollowSchema.createShopReviewSchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.user, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "shopReview", null);
__decorate([
    (0, common_1.Get)('/vendor/vendor-my-shop'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "vendorFindHisShop", null);
__decorate([
    (0, common_1.Get)('/admin/find-all-shops'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "adminFindAllShop", null);
__decorate([
    (0, common_1.Get)('/vendor/check/isExist-shop'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "isShopExist", null);
exports.ShopController = ShopController = __decorate([
    (0, common_1.Controller)('api/shop'),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
//# sourceMappingURL=shop.controller.js.map