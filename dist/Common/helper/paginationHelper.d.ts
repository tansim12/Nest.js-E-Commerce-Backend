type IOptions = {
    page?: number;
    limit?: number;
    sortOrder?: string;
    sortBy?: string;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
export declare const paginationHelper: {
    calculatePagination: (options: IOptions) => IOptionsResult;
};
export {};
