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

app.use(rateLimiterUsingThirdParty);

//version management
app.use("/api/live/phishing", PhishingRouter);

app.use("/api/develop/phishing", developPhishingRouter);

//for web app demo
const path = require('path');

var assetsPath = path.join(__dirname, '/DEMO WEB APP');

app.use(express.static(assetsPath));

app.get("/", (req,res) => {
    res.sendFile("DEMO WEB APP/pages/WebAppHome.html", {root: __dirname});
});
//remove inbetween comments if web app is not used

app.listen(process.env.PORT || 3000, () => {
    console.log('Api is listening on', process.env.PORT);
});