import { toast } from 'react-toastify';

export const useToast = () => {
    const toastSuccess = (message: string) => {
        toast.success(message, {
            autoClose: 3000,
            position: "top-right",
        })
    };

    const toastError = (message: string) => {
        toast.error(message, {
            autoClose: 3000,
            position: "top-right",
        })
    };

    return {
        toastSuccess,
        toastError
    }
}