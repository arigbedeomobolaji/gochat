interface Error {
    response?: {
        data: {
            message: string
        }
    },
    message: string
}
export const errorFormat = (error: Error) => {
    return error?.response?.data?.message || error.message;
}