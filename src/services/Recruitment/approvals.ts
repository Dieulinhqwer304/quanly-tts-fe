import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Approval {
    id: string;
    type: 'Conversion' | 'Recruitment';
    name: string;
    title: string;
    currentRole?: string;
    proposedRole?: string;
    mentor?: string;
    score?: number;
    salary?: number;
    budget?: number;
    department?: string;
    hr?: string;
    priority?: 'High' | 'Normal' | 'Low';
    status: 'Pending' | 'Approved' | 'Rejected' | 'Adjusting';
    createdAt: string;
    updatedAt: string;
}

export interface GetApprovalsParams {
    pagination?: PaginateParams;
    searcher?: SearchParams;
    type?: string;
    status?: string;
}

export const getApprovals = async (params?: GetApprovalsParams): Promise<ResponseListSuccess<Approval>> => {
    const queryParams: any = {
        q: params?.searcher?.keyword,
        _page: params?.pagination?.page || 1,
        _limit: params?.pagination?.pageSize || 10,
        status: params?.status || 'Pending'
    };

    if (params?.type && params.type !== 'all') {
        queryParams.type = params.type;
    }

    const response = await http.get('/approvals', { params: queryParams });
    const totalCount = parseInt(response.headers['x-total-count'] || '0');
    const data = response.data;

    return {
        code: 200,
        data: {
            hits: data,
            pagination: {
                totalPages: Math.ceil(totalCount / (params?.pagination?.pageSize || 10)),
                totalRows: totalCount
            }
        }
    };
};

export const getApproval = async (id: string): Promise<ResponseDetailSuccess<Approval>> => {
    const response = await http.get(`/approvals/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface UpdateApprovalParams {
    id: string;
    status: 'Approved' | 'Rejected' | 'Adjusting';
    notes?: string;
}

export const updateApproval = async (params: UpdateApprovalParams): Promise<ResponseDetailSuccess<Approval>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/approvals/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};
