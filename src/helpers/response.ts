// ========== Error Response
import { HttpException } from '@nestjs/common';
import { IResponse } from '../interfaces';
import { ResponseFunction } from '../types';

export const response: ResponseFunction = (results: IResponse) => {
	return new HttpException(results, results.status);
};
