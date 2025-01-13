"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginPassword = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const validateLoginPassword = async (plainTextPassword, hashPass) => {
    try {
        const result = await bcrypt_1.default.compare(plainTextPassword, hashPass);
        return result;
    }
    catch (err) {
        throw new common_1.HttpException(err.message || 'Something went wrong!', common_1.HttpStatus.BAD_REQUEST);
    }
};
exports.validateLoginPassword = validateLoginPassword;
//# sourceMappingURL=BcryptValidation.js.map