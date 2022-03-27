// ========== Response Types
import { HttpException } from '@nestjs/common';
import { IResponse } from '../interfaces';

export type ResponseFunction = (results: IResponse) => HttpException;
