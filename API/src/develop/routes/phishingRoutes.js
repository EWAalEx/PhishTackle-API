//Dependencies
const express = require("express");
const apicache = require("apicache");
const cache = apicache.middleware;

apicache.options({appendKey: (req, res) => req.body.content + ',' + req.body.urls })

const phishingController = require("../../controllers/phishingController");

//router innitialisation
const router = express.Router();

//routing table
router.route('/').get((req, res) => {
    res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
  });

router.get("/status", phishingController.getStatus);

router.post("/analyse", cache("10 minutes"), phishingController.analyseData);

//non defined endpoint
router.use( function(req, res, next) {
  res.status(404)
            .send({ status: "error", data: { error: "Not Found", request: req.url } });
}); 

//router finalisation
module.exports = router;