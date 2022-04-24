const handleError = async (err, req, res, _) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send({
            error: "Unauthorized"
        });
    }
    return res.status(500).send()
}

export default {handleError}