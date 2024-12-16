function errorHandlingMiddleware(error, req, res) {
    console.error(error);

    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = error.stack;
    }

    const errorResponse = {
        error: {
            message: error.message || 'Internal Server Error',
        }
    };

    const message = error.message || 'Internal Server Error';
    const statusCode = error.statusCode || 'Undefined Error Code';


    res.status(statusCode).json({
        error: {
            type: 'GenericError',
            message: message,
        }
    });
}

export default errorHandlingMiddleware;