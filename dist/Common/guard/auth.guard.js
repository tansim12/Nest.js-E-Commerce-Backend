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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
let AuthGuard = class AuthGuard {
    constructor(jwtService, prisma, reflector) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler()) || [];
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('You have no access to this route');
        }
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const { email } = decoded;
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { email, isDelete: false, status: client_1.UserStatus.active },
            });
            if (user.isDelete) {
                throw new common_1.ForbiddenException('This User is already deleted!');
            }
            if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
                throw new common_1.ForbiddenException('You have no access to this route');
            }
            request.user = { id: user.id, role: user.role, email: user.email };
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error?.message || 'You have no access to this route');
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map