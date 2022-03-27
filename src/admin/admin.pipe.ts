// ========== Admin Pipe
import {
	ArgumentMetadata,
	HttpStatus,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { response } from '../helpers';

@Injectable()
export class ValidationPipe implements PipeTransform {
	public async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}

		const object = plainToClass(metatype, value);
		const errors = await validate(object);

		if (errors.length > 0) {
			const [message] = Object.values(errors[0].constraints);
			throw response({
				status: HttpStatus.BAD_REQUEST,
				success: false,
				message,
			});
		}

		return value;
	}

	private toValidate(metatype: any): boolean {
		const types: any[] = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}
}
