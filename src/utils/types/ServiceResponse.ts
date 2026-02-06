export interface ResponseListSuccess<T> {
    code: number;
    data: {
        hits: T[];
        pagination: {
            totalRows: number;
            totalPages: number;
        };
    };
}

export interface ResponseDetailSuccess<T> {
    code: number;
    data: T;
}

export interface ResponseFailure {
    code: number;
    timestamp: string;
    path: string;
    message: string;
    errors: any[];
}

export enum SORT_TYPE {
    'DESC' = 'desc',
    'ASC' = 'asc'
}

export type SortParams = { sortBy: string; sortType: SORT_TYPE };

export type SearchParams = { keyword: string; field: string };

export type PaginateParams = { page: number; pageSize: number };

export type FilterParams = { name: string; value: string };

export type BaseQueryParams = Partial<SortParams> &
    Partial<SearchParams> &
    Partial<PaginateParams> &
    Partial<FilterParams>;
