import { message } from 'antd';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

class Http {
    instance: AxiosInstance;
    private instancePublic: AxiosInstance;

    constructor() {
        // Instance cho các API cần authentication
        this.instance = axios.create({
            // baseURL: 'https://book-tour-khaki.vercel.app/',
            baseURL: 'http://localhost:3001/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true // Cho phép gửi cookie trong request
        });

        // Instance cho các API public không cần authentication
        this.instancePublic = axios.create({
            // baseURL: 'https://book-tour-khaki.vercel.app/',
            baseURL: 'http://localhost:3001/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: false // Không gửi cookie trong request
        });

        this.instancePublic.interceptors.response.use(
            (response) => {
                const res = response.data;
                if (res.errorCode !== 0) {
                    message.error(res.message || 'Có lỗi xảy ra');
                    return Promise.reject(res);
                }
                return res.data;
            },
            (error) => {
                if (error.response) {
                    message.error(error.response.data?.message || 'Có lỗi xảy ra');
                }
                return Promise.reject(error);
            }
        );

        // Thêm interceptor để xử lý request cho instance có authentication
        this.instance.interceptors.request.use(
            (config) => {
                const token = Cookies.get('accessToken');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Thêm interceptor để xử lý response cho instance có authentication
        this.instance.interceptors.response.use(
            (response) => {
                const res = response.data;
                if (res.errorCode !== 0) {
                    if (res.errorCode === 1003) {
                        message.error(res.message || 'Phiên đăng nhập đã hết hạn');
                        Cookies.remove('accessToken');
                        // window.location.href = '/login';
                    } else {
                        message.error(res.message || 'Có lỗi xảy ra');
                    }
                    return Promise.reject(res);
                }
                return res.data;
            },
            (error) => {
                // Xử lý các lỗi HTTP status codes (nếu có)
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                            message.error(data?.message || 'Phiên đăng nhập đã hết hạn');
                            break;
                        case 403:
                            message.error('Bạn không có quyền truy cập');
                            break;
                        default:
                            message.error(data?.message || 'Có lỗi xảy ra');
                            break;
                    }
                } else {
                    message.error('Không thể kết nối đến server');
                }
                return Promise.reject(error);
            }
        );
    }

    // Getter cho instance public
    get public() {
        return this.instancePublic;
    }
}

export interface HttpClient {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
    interceptors: any;
}

// Xử lý type cast cho axios instance để khớp với interceptor return value
export const http = new Http().instance as unknown as HttpClient;
export const httpPublic = new Http().public as unknown as HttpClient;
