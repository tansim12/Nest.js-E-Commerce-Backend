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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const auth_guard_1 = require("../Common/guard/auth.guard");
const client_1 = require("@prisma/client");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const successResponse_1 = require("../Common/Re-useable/successResponse");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async adminAnalytics(req, res, next) {
        try {
            const result = await this.analyticsService.adminAnalyticsDB();
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Find admin analytics'));
        }
        catch (error) {
            next(error);
        }
    }
    async shopAnalytics(req, res, next) {
        try {
            const result = await this.analyticsService.shopAnalyticsDB(req?.user);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'shop analytics'));
        }
        catch (error) {
            next(error);
        }
    }
    async createNewsletter(req, res, next) {
        try {
            const result = await this.analyticsService.createNewsletterDB(req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'newsletter create'));
        }
        catch (error) {
            next(error);
        }
    }
    async findAllNewsLetterEmail(req, res, next) {
        try {
            const result = await this.analyticsService.findAllNewsLetterEmailDB();
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'newsletter find all'));
        }
        catch (error) {
            next(error);
        }
    }
    async newsletterGroupMessageSend(req, res, next) {
        try {
            const result = await this.analyticsService.newsletterGroupMessageSendDB(req?.body);
            res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'newsletter group message send done'));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('/admin'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "adminAnalytics", null);
__decorate([
    (0, common_1.Get)('/shop'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "shopAnalytics", null);
__decorate([
    (0, common_1.Post)('/newsletter'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createNewsletter", null);
__decorate([
    (0, common_1.Get)('/newsletter'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "findAllNewsLetterEmail", null);
__decorate([
    (0, common_1.Post)('/newsletter/group-message'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "newsletterGroupMessageSend", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('api/analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map