import {ZodError} from "zod";

const getUniqueErrorMessage = (err) => {
    let output;
    try {
        let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'))
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + 'already exists';
    } catch (err) {
        output = 'Unique field already exists';
    }
    return output;
}

const processZodError = (error: ZodError) => {
    const errorObject = {
        errors: []
    };

    error.issues.forEach(issue => {
        errorObject.errors.push(`${issue.path[0]} ${issue.message}`)
    })

    return errorObject;
}

const getErrorMessage = (err) => {
    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

export class ValidationError extends Error {
    errors: {
        [idx: string]: string
    };

    constructor(errors) {
        super();
        this.errors = errors;
    }
}

export class AuthenticationError extends Error {
    constructor() {
        super('Authentication Failed');
    }
}


export default {getErrorMessage, processZodError}