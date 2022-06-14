const handleError = async (err, req, res, _) => {
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