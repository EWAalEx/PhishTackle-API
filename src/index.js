//Configure express
const express = require('express');

const liveRouter = require("./live/routes");
const developRouter = require("./develop/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/live", liveRouter);

app.use("/api/develop", developRouter);


app.listen(PORT, () => {
    console.log('Api is listening on', PORT);
});