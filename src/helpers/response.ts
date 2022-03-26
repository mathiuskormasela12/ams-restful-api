// ========== Response
// import all modules
import { HttpException } from '@nestjs/common';
import { parse } from 'url';
import { appConfig } from '../config';

export function response(
	url,
	status: any,
	success: boolean,
	message: string,
	results?: any,
	totalData?: number,
	totalPages?: number,
) {
	const {
		pathname,
		query: { page = 1, ...query },
	} = parse(url, true);
	const queries = { page, ...query };

	if (results && totalData && totalPages) {
		throw new HttpException(
			{
				status,
				success,
				message,
				results,
				pageInfo: {
					page: Number(page),
					totalPages,
					totalData,
					previousLink:
						page > 1
							? `${appConfig.APP_URL}${pathname}?${Object.keys(queries)
									.map(
										(item, index) =>
											`${item}=${
												item === 'page'
													? `${Number(Object.values(queries)[index]) - 1}`
													: `${Object.values(queries)[index]}`
											}`,
									)
									.join('&')}`
							: null,
					nextLink:
						page <= totalData
							? `${appConfig.APP_URL}${pathname}?${Object.keys(queries)
									.map(
										(item, index) =>
											`${item}=${
												item === 'page'
													? `${Number(Object.values(queries)[index]) + 1}`
													: `${Object.values(queries)[index]}`
											}`,
									)
									.join('&')}`
							: null,
				},
			},
			status,
		);
	} else if (results) {
		throw new HttpException(
			{
				status,
				success,
				message,
				results,
			},
			status,
		);
	} else {
		throw new HttpException(
			{
				status,
				success,
				message,
			},
			status,
		);
	}
}
