"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const axios_1 = require("axios");
const verifyPayment = async (txnId) => {
    const response = await axios_1.default.get(process.env.AAMAR_PAY_SEARCH_TNX_BASE_URL, {
        params: {
            signature_key: process.env.AAMAR_PAY_SIGNATURE_KEY,
            store_id: 'aamarpaytest',
            request_id: txnId,
            type: 'json',
        },
    });
    return response?.data;
};
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=verifyPayment.js.map