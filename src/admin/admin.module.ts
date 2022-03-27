// ========== Admin Module
// import all modules
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ValidationPipe } from './admin.pipe';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
	imports: [JwtModule.register({})],
	controllers: [AdminController],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		AdminService,
	],
})
export class AdminModule {}
