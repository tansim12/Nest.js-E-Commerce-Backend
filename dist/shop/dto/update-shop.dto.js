"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShopDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_shop_dto_1 = require("./create-shop.dto");
class UpdateShopDto extends (0, mapped_types_1.PartialType)(create_shop_dto_1.CreateShopDto) {
}
exports.UpdateShopDto = UpdateShopDto;
//# sourceMappingURL=update-shop.dto.js.map