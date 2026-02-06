import { Account } from '../../models/Account';
import {
    ResponseListSuccess,
    SearchParams,
    SortParams,
    PaginateParams,
    FilterParams
} from '../../utils/types/ServiceResponse';
import { http } from '../../utils/http';

export interface GetAccounts {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    sort?: SortParams;
    filter?: FilterParams;
}

export type AccountsResponseData = Account;

export const getAccounts = async (params?: GetAccounts): Promise<ResponseListSuccess<AccountsResponseData>> => {
    const response = await http.get('/accounts', {
        params: {
            sortBy: params?.sort?.sortBy,
            sortType: params?.sort?.sortType,
            keyword: params?.searcher?.keyword,
            field: params?.searcher?.field,
            offset: params?.pagination?.page
                ? ((params?.pagination?.page ?? 1) - 1) * (params?.pagination?.pageSize ?? 10)
                : undefined,
            limit: params?.pagination?.pageSize ? params?.pagination?.pageSize : 10,
            status: params?.filter?.value
        }
    });

    console.log(response);

    const res = response.data;

    return {
        code: res.code,
        data: {
            hits: res.data.hits,
            pagination: {
                totalPages: res.data.pagination.totalPages,
                totalRows: res.data.pagination.totalRows
            }
        }
    };
};
