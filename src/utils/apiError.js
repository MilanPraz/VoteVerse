export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message); // here super will used to call the parent class that is Error so we call Error ko constructor and tesma pass garxam hamro custom message so that we can access easilty through err.message later.
        this.statusCode = statusCode;
        this.success = false;
    }
}
