"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAndSubCModule = void 0;
const common_1 = require("@nestjs/common");
const c_and_sub_c_service_1 = require("./c-and-sub-c.service");
const c_and_sub_c_controller_1 = require("./c-and-sub-c.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
let CAndSubCModule = class CAndSubCModule {
};
exports.CAndSubCModule = CAndSubCModule;
exports.CAndSubCModule = CAndSubCModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), config_1.ConfigModule],
        controllers: [c_and_sub_c_controller_1.CAndSubCController],
        providers: [c_and_sub_c_service_1.CAndSubCService, prisma_service_1.PrismaService],
    })
], CAndSubCModule);
//# sourceMappingURL=c-and-sub-c.module.js.map