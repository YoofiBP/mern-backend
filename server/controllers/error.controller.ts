import {ValidationError} from "../helpers/dbErrorHandler";

const handleError = async (err, req, res, _) => {
    console.log(err);
    if (err instanceof ValidationError) {
        return res.status(422).send(err.errors)
    }
    if (err.name === 'NotFoundError') {
        return res.status(404).send({
            error: err.message
        })
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({
            error: "Unauthorized"
        });
    }
    return res.status(500).send({
        error: "Something went wrong"
    })
}

export default {handleError}