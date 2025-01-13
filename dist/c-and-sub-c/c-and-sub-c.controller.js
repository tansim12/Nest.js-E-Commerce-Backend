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
exports.CAndSubCController = void 0;
const common_1 = require("@nestjs/common");
const c_and_sub_c_service_1 = require("./c-and-sub-c.service");
const client_1 = require("@prisma/client");
const role_decorator_1 = require("../Common/decorators/role.decorator");
const successResponse_1 = require("../Common/Re-useable/successResponse");
const auth_guard_1 = require("../Common/guard/auth.guard");
const zodValidatiionPipe_1 = require("../Common/pipes/zodValidatiionPipe");
const c_and_sub_c_zodSchema_1 = require("./c-and-sub-c.zodSchema");
const pick_1 = require("../Common/shared/pick");
const c_and_sub_c_const_1 = require("./c-and-sub-c.const");
let CAndSubCController = class CAndSubCController {
    constructor(cAndSubCService) {
        this.cAndSubCService = cAndSubCService;
    }
    async createCategory(req, res, next, body) {
        try {
            const result = await this.cAndSubCService.createCategoryDB(req?.user, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'create category '));
        }
        catch (error) {
            next(error);
        }
    }
    async updateCategory(req, res, next, body) {
        try {
            const result = await this.cAndSubCService.updateCategoryDB(req?.params?.categoryId, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'update category '));
        }
        catch (error) {
            next(error);
        }
    }
    async createSubCategory(req, res, next, body) {
        try {
            const result = await this.cAndSubCService.createSubCategoryDB(req?.user, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'create sub-category '));
        }
        catch (error) {
            next(error);
        }
    }
    async updateSubCategory(req, res, next, body) {
        try {
            const result = await this.cAndSubCService.updateSubCategoryDB(req?.params?.subCategoryId, body);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'update sub category '));
        }
        catch (error) {
            next(error);
        }
    }
    async findAllCategory(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, c_and_sub_c_const_1.categoryFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.cAndSubCService.findAllCategoryDB(filters, options);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all category '));
        }
        catch (error) {
            next(error);
        }
    }
    async findAllSubCategory(req, res, next) {
        try {
            const filters = (0, pick_1.default)(req.query, c_and_sub_c_const_1.categoryFilterAbleFields);
            const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
            const result = await this.cAndSubCService.findAllSubCategoryDB(filters, options);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all sub category '));
        }
        catch (error) {
            next(error);
        }
    }
    async existFindAllCategory(res, next) {
        try {
            const result = await this.cAndSubCService.existFindAllCategoryDB();
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'find all exist category '));
        }
        catch (error) {
            next(error);
        }
    }
    async singleCategoryBaseFindAllSubCategory(req, res, next) {
        try {
            const result = await this.cAndSubCService.singleCategoryBaseFindAllSubCategoryDB(req?.params?.categoryId);
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'Category base find all sub category just name and id send'));
        }
        catch (error) {
            next(error);
        }
    }
    async publicFindAllCategoryWithSubCategory(res, next) {
        try {
            const result = await this.cAndSubCService.publicFindAllCategoryWithSubCategoryDB();
            return res.send((0, successResponse_1.successResponse)(result, common_1.HttpStatus.OK, 'All Category and sub category find '));
        }
        catch (error) {
            next(error);
        }
    }
};
exports.CAndSubCController = CAndSubCController;
__decorate([
    (0, common_1.Post)('/create-category'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(c_and_sub_c_zodSchema_1.categoryAndSubCategorySchema.createCategorySchema)),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('/update-category/:categoryId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(c_and_sub_c_zodSchema_1.categoryAndSubCategorySchema.updateCategorySchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Post)('/create-sub-category'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(c_and_sub_c_zodSchema_1.categoryAndSubCategorySchema.createSubCategorySchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "createSubCategory", null);
__decorate([
    (0, common_1.Put)('/update-sub-category/:subCategoryId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    (0, common_1.UsePipes)(new zodValidatiionPipe_1.ZodValidationPipe(c_and_sub_c_zodSchema_1.categoryAndSubCategorySchema.updateSubCategorySchema)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function, Object]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "updateSubCategory", null);
__decorate([
    (0, common_1.Get)('/category'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "findAllCategory", null);
__decorate([
    (0, common_1.Get)('/sub-category'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "findAllSubCategory", null);
__decorate([
    (0, common_1.Get)('/category/admin/allCategory'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "existFindAllCategory", null);
__decorate([
    (0, common_1.Get)('/category/categoryBaseSubCategory/:categoryId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, role_decorator_1.Roles)(client_1.UserRole.admin, client_1.UserRole.vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "singleCategoryBaseFindAllSubCategory", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], CAndSubCController.prototype, "publicFindAllCategoryWithSubCategory", null);
exports.CAndSubCController = CAndSubCController = __decorate([
    (0, common_1.Controller)('api/cAndSubC'),
    __metadata("design:paramtypes", [c_and_sub_c_service_1.CAndSubCService])
], CAndSubCController);
//# sourceMappingURL=c-and-sub-c.controller.js.map