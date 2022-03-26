// ========== Auth Module
// import all modules
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ValidationPipe } from './auth.pipe';
import { AuthService } from './auth.service';

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		AuthService,
	],
})
export class AuthModule {}
