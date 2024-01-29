//Configure express
const express = require('express');
const bodyParser = require("body-parser");
const apicache = require("apicache");


//innitialising required routers
const liveRouter = require("./live/routes");
const developRouter = require("./develop/routes");
const developPhishingRouter = require("./develop/routes/phishingRoutes");

const app = express();
const cache = apicache.middleware;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cache("15 seconds"));

//version management
app.use("/api/live", liveRouter);

app.use("/api/develop", developRouter);

app.use("/api/develop/phishing", developPhishingRouter);


app.listen(PORT, () => {
    console.log('Api is listening on', PORT);
});