"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnalyticsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_analytics_dto_1 = require("./create-analytics.dto");
class UpdateAnalyticsDto extends (0, mapped_types_1.PartialType)(create_analytics_dto_1.CreateAnalyticsDto) {
}
exports.UpdateAnalyticsDto = UpdateAnalyticsDto;
//# sourceMappingURL=update-analytics.dto.js.map