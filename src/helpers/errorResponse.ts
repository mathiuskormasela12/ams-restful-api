// ========== Error Response
import { HttpException } from '@nestjs/common';

export function errorResponse(status: number, message: string) {
	return new HttpException({ status, success: false, message }, status);
}
