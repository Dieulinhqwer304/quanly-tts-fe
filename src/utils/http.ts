import { message } from 'antd';
import axios, { AxiosInstance } from 'axios';

class Http {
    instance: AxiosInstance;
    private instancePublic: AxiosInstance;

    constructor() {
        // Instance cho các API cần authentication
        this.instance = axios.create({
            // baseURL: 'https://book-tour-khaki.vercel.app/',
            baseURL: 'http://localhost:3000/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true // Cho phép gửi cookie trong request
        });

        // Instance cho các API public không cần authentication
        this.instancePublic = axios.create({
            // baseURL: 'https://book-tour-khaki.vercel.app/',
            baseURL: 'http://localhost:3000/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: false // Không gửi cookie trong request
        });

        // Thêm interceptor để xử lý request cho instance có authentication
        this.instance.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Thêm interceptor để xử lý response cho instance có authentication
        this.instance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // Xử lý các lỗi từ server
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            // Xử lý khi token hết hạn hoặc không hợp lệ
                            // Có thể redirect về trang login
                            // window.location.href = '/login';
                            message.error('Phiên đăng nhập đã hết hạn');
                            break;
                        case 403:
                            // Xử lý khi không có quyền truy cập
                            message.error('Bạn không có quyền truy cập');
                            break;
                        default:
                            break;
                    }
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

export const http = new Http().instance;
export const httpPublic = new Http().public;
