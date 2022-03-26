// ========== Main
// import all modules
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: appConfig.WHITE_LIST,
	});
	await app.listen(appConfig.PORT);
	Logger.log(`The RESTful Api is running at ${appConfig.API_URL}`, 'API URL');
}
bootstrap();
