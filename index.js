const config = require("./utils/config");
const logger = require("./utils/logger");
const app = require("./app");
const https = require("https");
const fs = require("fs");

app.listen(config.PORT, () => {
    logger.info(`Server running at port ${config.PORT}`);
});

// https
//     .createServer(
//         {
//             key: fs.readFileSync("key.pem"),
//             cert: fs.readFileSync("cert.pem"),
//         },
//         app
//     )
//     .listen(config.PORT, () => {
//         logger.info(`Server running on port ${config.PORT}`);
//     });
