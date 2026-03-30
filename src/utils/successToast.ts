import { notification } from 'antd';

interface SuccessToastOptions {
    title: string;
    description?: string;
    duration?: number;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastDispatcher = (type: ToastType, message: string, description?: string, duration?: number) => void;

let toastDispatcher: ToastDispatcher | null = null;

export const registerToastDispatcher = (dispatcher: ToastDispatcher) => {
    toastDispatcher = dispatcher;
};

export const unregisterToastDispatcher = (dispatcher?: ToastDispatcher) => {
    if (!dispatcher || toastDispatcher === dispatcher) {
        toastDispatcher = null;
    }
};

const openToast = (type: ToastType, title: string, description?: string, duration: number = 3) => {
    if (toastDispatcher) {
        toastDispatcher(type, title, description, duration);
        return;
    }

    notification[type]({
        message: title,
        description,
        duration,
        placement: 'topRight'
    });
};

export const showSuccessToast = ({ title, description, duration = 3 }: SuccessToastOptions) => {
    openToast('success', title, description, duration);
};

export const showCreateSuccessToast = (entityName?: string, description?: string) =>
    showSuccessToast({
        title: entityName ? `Thêm ${entityName} thành công` : 'Thêm mới thành công',
        description
    });

export const showUpdateSuccessToast = (entityName?: string, description?: string) =>
    showSuccessToast({
        title: entityName ? `Cập nhật ${entityName} thành công` : 'Cập nhật thành công',
        description
    });

export const showSaveSuccessToast = (entityName?: string, description?: string) =>
    showSuccessToast({
        title: entityName ? `Lưu ${entityName} thành công` : 'Lưu thành công',
        description
    });

export const showEmailSuccessToast = (description?: string) =>
    showSuccessToast({
        title: 'Gửi email thành công',
        description
    });
