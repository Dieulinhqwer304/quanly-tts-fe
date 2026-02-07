import { http } from '../../utils/http';
import { ResponseDetailSuccess, ResponseListSuccess } from '../../utils/types/ServiceResponse';

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correct: number;
}

export interface Quiz {
    id: string;
    moduleId: number;
    title: string;
    questions: QuizQuestion[];
    meta?: string;
}

export const getQuizzes = async (): Promise<ResponseListSuccess<Quiz>> => {
    const response = await http.get('/quizzes');
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

export const getQuiz = async (id: string): Promise<ResponseDetailSuccess<Quiz>> => {
    const response = await http.get(`/quizzes/${id}`);
    return {
        code: 200,
        data: response.data
    };
};

export const createQuiz = async (data: Omit<Quiz, 'id'>): Promise<ResponseDetailSuccess<Quiz>> => {
    const response = await http.post('/quizzes', data);
    return {
        code: 201,
        data: response.data
    };
};

export const updateQuiz = async (data: Partial<Quiz> & { id: string }): Promise<ResponseDetailSuccess<Quiz>> => {
    const response = await http.put(`/quizzes/${data.id}`, data);
    return {
        code: 200,
        data: response.data
    };
};
