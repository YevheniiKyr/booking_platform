class ApiError extends Error {

    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequestError(message, errors) {
        return new ApiError(400, message, errors);
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Unauthorized');
    }

    static AccessDeniedError() {
        return new ApiError(403, 'Access denied');
    }

    static NotFoundError(message) {
        return new ApiError(404, message);
    }

}

module.exports = ApiError;