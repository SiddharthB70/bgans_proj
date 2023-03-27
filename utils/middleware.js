const logger = require("./logger");
const jwt = require("jsonwebtoken");

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === "CastError") {
        return response.status(400).json({ error: "malformatted error" });
    } else if (error.name === "ValidationError") {
        return response.status(401).json({ error: error.message });
    } else if (error.name === "PasswordValidation") {
        return response.status(401).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: "invalid token" });
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({ error: "token expired" });
    }
    next(error);
};

const requestLogger = (request, response, next) => {
    logger.info("Method", request.method);
    logger.info("Path", request.path);
    logger.info("Body", request.body);
    logger.info("---");
    next();
};

// const tokenExtractor = (request, response, next) => {
//     request.token = null;
//     const authorization = request.get("authorization");
//     if (authorization && authorization.startsWith("Bearer ")) {
//         request.token = authorization.replace("Bearer ", "");
//     }
//     next();
// };

// const userExtractor = (request, response, next) => {
//     const decodedToken = jwt.verify(request.token, process.env.SECRET);
//     if (!decodedToken) {
//         return response.status(401).json({ error: "token invalid" });
//     }
//     request.user = decodedToken;
//     next();
// };

const allowMethods = (request, response, next) => {
    const allowMethods = [
        "OPTIONS",
        "HEAD",
        "CONNECT",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
    ];

    if (!allowMethods.includes(request.method)) {
        response.status(405).send({ error: `${request.method} not allowed` });
    }

    next();
};

const userExtractor = (request, response, next) => {
    if (!request.cookies.token) {
        request.cookies.token = null;
    }
    const decodedToken = jwt.verify(
        JSON.parse(request.cookies.token),
        process.env.SECRET
    );
    if (!decodedToken) {
        return response.status(401).json({ error: "token invalid" });
    }
    request.user = decodedToken;
    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger,
    userExtractor,
    allowMethods,
};
