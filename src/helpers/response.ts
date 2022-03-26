// ========== Response
// import all modules
import { parse } from 'url';
import { appConfig } from '../config';

export function response(
	url: string,
	status: any,
	success: boolean,
	message: string,
	results?: any,
	totalData?: number,
	totalPages?: number,
) {
	if (results && totalData && totalPages) {
		const {
			pathname,
			query: { page = 1, ...query },
		} = parse(url, true);
		const queries = { page, ...query };
		return {
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
		};
	} else if (results) {
		return {
			status,
			success,
			message,
			results,
		};
	} else {
		return {
			status,
			success,
			message,
		};
	}
}
