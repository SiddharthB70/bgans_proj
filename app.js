const express = require("express");
require("express-async-errors");
const config = require("./utils/config");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const cookieParser = require("cookie-parser");

logger.info("Connecting to Database ...");
mongoose.set("strictQuery", false);
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("Connected to MongoDB (Primary URI)");
    })
    .catch((error) => {
        logger.error(
            "Unable to Connect to Primary MongoDB URI. Trying Secondary MongoDB URI",
            error.message
        );
        mongoose
            .connect(config.SECONDARY_MONGODB_URI)
            .then(() => {
                logger.info("Connected to MongoDB (Secondary URI)");
            })
            .catch((error) => {
                logger.error(
                    "Unable to Connect to Secondary MongoDB URI",
                    error.message
                );
                logger.info(config.SECONDARY_MONGODB_URI);
            });
    });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.allowMethods);

app.use("/", express.static("build"));
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", cookieParser(), middleware.userExtractor, logoutRouter);

app.use("/api/blogs", cookieParser(), middleware.userExtractor, blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
