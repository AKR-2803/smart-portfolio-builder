export const getErrorMessage = (error) => {
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
    return !error.response && error.message === 'Network Error';
};

export const isValidationError = (error) => {
    return error.response?.status === 400;
}; 