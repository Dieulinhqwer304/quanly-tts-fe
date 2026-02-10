import { http } from '../../utils/http';
import { ResponseListSuccess, ResponseDetailSuccess } from '../../utils/types/ServiceResponse';

export interface LearningModuleItem {
    id: string | number;
    type: 'video' | 'file' | 'document' | 'quiz';
    title: string;
    meta: string;
}

export interface LearningModule {
    id: number;
    title: string;
    status: 'Ready' | 'In Progress' | 'Locked';
    description: string;
    progress: number;
    items: LearningModuleItem[];
}

export interface LearningPath {
    id: string;
    track: string;
    modules: LearningModule[];
}

export const getLearningPaths = async (): Promise<ResponseListSuccess<LearningPath>> => {
    const response = await http.get('/learningPaths');
    return {
        code: 200,
        data: {
            hits: response.data,
            pagination: {
                totalPages: 1,
                totalRows: response.data.length
            }
        }
    };
};

export const getLearningPathByTrack = async (track: string): Promise<ResponseDetailSuccess<LearningPath>> => {
    const response = await http.get('/learningPaths', {
        params: { track }
    });
    return {
        code: 200,
        data: response.data[0]
    };
};

export const updateLearningPath = async (
    id: string,
    data: Partial<LearningPath>
): Promise<ResponseDetailSuccess<LearningPath>> => {
    const response = await http.patch(`/learningPaths/${id}`, {
        ...data,
        updatedAt: new Date().toISOString()
    });
    return {
        code: 200,
        data: response.data
    };
};
