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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const auth_guard_1 = require("../Common/guard/auth.guard");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const client_1 = require("@prisma/client");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const user_const_1 = require("./user.const");
const pick_1 = require("../Common/shared/pick");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAllUsers(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, user_const_1.userFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.userService.getAllUsersDB(filters, options);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find All User'));
        }
        catch (error) {
            next(error);
        }
    }
    async adminUpdateUser(req, res, next) {
        try {
            const result = await this.userService.adminUpdateUserDB(req?.params?.userId, req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'admin update profile'));
        }
        catch (error) {
            next(error);
        }
    }
    async findMyProfile(req, res, next) {
        try {
            const result = await this.userService.findMyProfileDB(req?.user);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find my profile'));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMyProfile(req, res, next) {
        try {
            const result = await this.userService.updateMyProfileDB(req?.user, req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'update my profile'));
        }
        catch (error) {
            next(error);
        }
    }
    async getSingleUser(req, res, next) {
        try {
            const result = await this.userService.getSingleUserDB(req.params?.userId);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'update my profile'));
        }
        catch (error) {
            next(error);
        }
    }
    async createWishlist(req, res, next) {
        try {
            const result = await this.userService.createWishlistDB(req?.user, req?.body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'wish list create'));
        }
        catch (error) {
            next(error);
        }
    }
    async findUserAllWishList(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, user_const_1.userWishListFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.userService.findUserAllWishListDB(filters, options, req?.user);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find All User wishlist'));
        }
        catch (error) {
            next(error);
        }
    }
    async singleDeleteWishListProduct(req, res, next) {
        try {
            const result = await this.userService.singleDeleteWishListProductDB(req?.user, req?.params?.id);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, ' wishlist delete'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('/admin-update-user/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminUpdateUser", null);
__decorate([
    (0, common_1.Get)('/find/my-profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findMyProfile", null);
__decorate([
    (0, common_1.Put)('/update-my-profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Get)('/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSingleUser", null);
__decorate([
    (0, common_1.Post)('/wishList'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createWishlist", null);
__decorate([
    (0, common_1.Get)('/wishList/all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserAllWishList", null);
__decorate([
    (0, common_1.Delete)('/wishList/all/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor, client_1.UserRole.user),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "singleDeleteWishListProduct", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api/user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map