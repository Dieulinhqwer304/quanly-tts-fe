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
    details?: any;
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
        page: params?.pagination?.page || 1,
        limit: params?.pagination?.pageSize || 10,
        status: params?.status,
        type: params?.type
    };

    const result = await http.get<any>('/approvals', { params: queryParams });
    return result;
};

export const getApproval = async (id: string): Promise<ResponseDetailSuccess<Approval>> => {
    const result = await http.get<ResponseDetailSuccess<Approval>>(`/approvals/${id}`);
    return result;
};

export interface UpdateApprovalParams {
    id: string;
    status: 'Approved' | 'Rejected' | 'Adjusting';
    notes?: string;
}

export const updateApproval = async (params: UpdateApprovalParams): Promise<ResponseDetailSuccess<Approval>> => {
    const { id, ...data } = params;
    const result = await http.patch<ResponseDetailSuccess<Approval>>(`/approvals/${id}`, data);
    return result;
};
