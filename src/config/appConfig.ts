// ========== App Configurations
// import all modules
import 'dotenv/config';

export const appConfig = {
	PORT: Number(process.env.PORT),
	APP_URL: process.env.APP_URL,
	API_URL: process.env.API_URL,
	PUBLIC_URL: process.env.PUBLIC_URL,
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
	JWT_ACCESS_TOKEN_KEY: process.env.JWT_ACCESS_TOKEN_KEY,
	JWT_REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY,
	DATABASE_URL: process.env.DATABASE_URL,
	WHITE_LIST: ['http://127.0.0.1:3000'],
};
