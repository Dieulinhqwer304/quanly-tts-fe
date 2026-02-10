import { http } from '../../utils/http';
import { ResponseDetailSuccess, ResponseListSuccess } from '../../utils/types/ServiceResponse';

export interface StudentProgress {
    id: string;
    internId: string;
    learningPathId: string;
    modulesCompleted: number[];
    currentModuleId: number | null;
    quizScores: Record<string, number>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStudentProgressParams {
    internId: string;
    learningPathId: string;
    modulesCompleted?: number[];
    currentModuleId: number | null;
    quizScores?: Record<string, number>;
}

export interface SubmitModuleQuizParams {
    internId: string;
    moduleId: number;
    quizId: string;
    score: number;
    passScore: number;
}

export const getStudentProgressByIntern = async (internId: string): Promise<ResponseDetailSuccess<StudentProgress>> => {
    const response = await http.get('/studentProgress', { params: { internId } });
    return {
        code: 200,
        data: response.data[0]
    };
};

export const createStudentProgress = async (
    params: CreateStudentProgressParams
): Promise<ResponseDetailSuccess<StudentProgress>> => {
    const response = await http.post('/studentProgress', {
        ...params,
        modulesCompleted: params.modulesCompleted || [],
        quizScores: params.quizScores || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    return {
        code: 201,
        data: response.data
    };
};

export const submitModuleQuiz = async (params: SubmitModuleQuizParams): Promise<ResponseDetailSuccess<StudentProgress>> => {
    const progressRes = await http.get('/studentProgress', { params: { internId: params.internId } });
    const progress = progressRes.data[0] as StudentProgress | undefined;

    if (!progress) {
        throw new Error('Student progress not found');
    }

    const learningPathRes = await http.get(`/learningPaths/${progress.learningPathId}`);
    const modules: Array<{ id: number }> = learningPathRes.data?.modules || [];
    const moduleIds = modules.map((module) => module.id);

    const hasPassed = params.score >= params.passScore;
    const completedSet = new Set(progress.modulesCompleted || []);

    if (hasPassed) {
        completedSet.add(params.moduleId);
    }

    const modulesCompleted = moduleIds.filter((moduleId) => completedSet.has(moduleId));
    const currentModuleId = moduleIds.find((moduleId) => !completedSet.has(moduleId)) ?? null;

    const quizScores = {
        ...(progress.quizScores || {}),
        [params.quizId]: params.score
    };

    const patchResponse = await http.patch(`/studentProgress/${progress.id}`, {
        modulesCompleted,
        currentModuleId,
        quizScores,
        updatedAt: new Date().toISOString()
    });

    const totalModules = moduleIds.length || 1;
    const progressPercent = Math.round((modulesCompleted.length / totalModules) * 100);

    await http.patch(`/interns/${params.internId}`, {
        progress: progressPercent,
        status: currentModuleId === null ? 'Completed' : 'Active',
        updatedAt: new Date().toISOString()
    });

    return {
        code: 200,
        data: patchResponse.data
    };
};

export const getStudentProgressList = async (): Promise<ResponseListSuccess<StudentProgress>> => {
    const response = await http.get('/studentProgress');
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
