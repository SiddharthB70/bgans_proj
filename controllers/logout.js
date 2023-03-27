const logoutRouter = require("express").Router();

logoutRouter.post("/", (request, response) => {
    const { username } = request.body;
    const tokenUsername = request.user.username;
    if (username !== tokenUsername) {
        return response.status(401).end();
    }
    response.clearCookie("token", {
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
    });
    response.status(200).end();
});

module.exports = logoutRouter;
