//Configure express
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("./middleware/cors.js");
const {rateLimiterUsingThirdParty} = require("./middleware/ratelimiter.js");


//innitialising required routers
const developPhishingRouter = require("./develop/routes/phishingRoutes");
const PhishingRouter = require("./live/routes/phishingRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

//version management
app.use("/api/live/phishing", PhishingRouter);

app.use("/api/develop/phishing", developPhishingRouter);

app.use(rateLimiterUsingThirdParty);

app.listen(PORT, () => {
    console.log('Api is listening on', PORT);
});