import { http } from '../../utils/http';
import {
    ResponseListSuccess,
    ResponseDetailSuccess,
    SearchParams,
    PaginateParams
} from '../../utils/types/ServiceResponse';

export interface Candidate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string;
    education: string;
    experience: string;
    skills: string[];
    resumeUrl: string;
    appliedDate: string;
    job?: {
        id: string;
        title: string;
        department: string;
    };
    status: string;
    matchScore: number;
    coverLetter: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetCandidatesParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export const getCandidates = async (params?: GetCandidatesParams): Promise<ResponseListSuccess<Candidate>> => {
    const response = await http.get('/candidates', { params });
    const data = response.data;

    // Backend hiện đang trả về array trực tiếp (chưa phân trang ở tầng controller)
    // Tôi sẽ giả lập cấu trúc bọc để khớp với UI
    return {
        code: 200,
        data: {
            hits: data,
            pagination: {
                totalPages: 1,
                totalRows: data.length
            }
        }
    };
};

export const getCandidate = async (id: string): Promise<ResponseDetailSuccess<Candidate>> => {
    const response = await http.get(`/candidates/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export interface UpdateCandidateParams {
    id: string;
    status?: string;
    matchScore?: number;
    notes?: string;
}

export const updateCandidate = async (params: UpdateCandidateParams): Promise<ResponseDetailSuccess<Candidate>> => {
    const { id, ...data } = params;
    const response = await http.patch(`/candidates/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};

export interface ShortlistCandidateParams {
    id: string;
}

export const shortlistCandidate = async (
    params: ShortlistCandidateParams
): Promise<ResponseDetailSuccess<Candidate>> => {
    return updateCandidate({
        id: params.id,
        status: 'Shortlisted'
    });
};

export interface RejectCandidateParams {
    id: string;
    reason?: string;
}

export const rejectCandidate = async (params: RejectCandidateParams): Promise<ResponseDetailSuccess<Candidate>> => {
    return updateCandidate({
        id: params.id,
        status: 'Rejected'
    });
};

export interface PassInterviewCandidateParams {
    id: string;
}

export const passInterviewCandidate = async (
    params: PassInterviewCandidateParams
): Promise<ResponseDetailSuccess<Candidate>> => {
    return updateCandidate({
        id: params.id,
        status: 'Passed Interview'
    });
};

export interface CreateCandidateParams {
    name: string;
    email: string;
    phone: string;
    location?: string;
    role: string;
    education?: string;
    experience?: string;
    skills?: string[];
    appliedFor: string;
    appliedForTitle: string;
    coverLetter?: string;
}

export const createCandidate = async (params: CreateCandidateParams): Promise<ResponseDetailSuccess<Candidate>> => {
    const response = await http.post('/candidates', {
        ...params,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
        status: 'Pending Review',
        matchScore: Math.floor(Math.random() * 40) + 60,
        timeAgo: 'Just now',
        appliedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    return {
        code: 201,
        data: response.data
    };
};

export interface DeleteCandidateParams {
    id: string;
}

export const deleteCandidate = async (params: DeleteCandidateParams): Promise<ResponseDetailSuccess<null>> => {
    await http.delete(`/candidates/${params.id}`);
    return {
        code: 200,
        data: null
    };
};
