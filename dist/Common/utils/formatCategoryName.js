"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCategoryName = void 0;
const formatCategoryName = (name) => {
    return name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
exports.formatCategoryName = formatCategoryName;
//# sourceMappingURL=formatCategoryName.js.map