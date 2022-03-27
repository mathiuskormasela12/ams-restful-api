// ========== Admin Services
// import all modules

import { Injectable, Body, Request } from '@nestjs/common';

@Injectable()
export class AdminService {
	public createAdmin(@Request() req: Request, @Body() body: Body) {
		return body;
	}
}
