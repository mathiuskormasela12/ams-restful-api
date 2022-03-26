// ========== IResponse

export interface IResponse {
	status: number;
	success: boolean;
	message: string;
	results?: any;
	pageInfo?: {
		page: number;
		totalPages: number;
		totalData: number;
		previousLink: string | null;
		nextLink: string | null;
	};
}
