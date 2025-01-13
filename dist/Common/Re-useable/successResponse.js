"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = (result, statusCode, message) => {
    return {
        success: true,
        statusCode: statusCode,
        message: message,
        data: result,
    };
};
exports.successResponse = successResponse;
//# sourceMappingURL=successResponse.js.map