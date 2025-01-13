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
exports.EmailUtils = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
let EmailUtils = class EmailUtils {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASS,
            },
        });
    }
    async sendEmail(to, subject, html) {
        await this.transporter.sendMail({
            from: `"Password Reset" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        });
    }
    async sendManyEmails(emailArray, subject, html) {
        await Promise.all(emailArray.map((email) => this.transporter.sendMail({
            from: `"E-Commerce" <${process.env.EMAIL}>`,
            to: email,
            subject,
            html,
        })));
    }
};
exports.EmailUtils = EmailUtils;
exports.EmailUtils = EmailUtils = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailUtils);
//# sourceMappingURL=emil.utils.js.map