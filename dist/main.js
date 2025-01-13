"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://e-commerce-next-a9.vercel.app',
        ],
        credentials: true,
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port');
    app.use(cookieParser());
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map