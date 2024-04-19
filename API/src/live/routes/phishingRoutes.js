//Dependencies
const express = require("express");
const apicache = require("apicache");
const cache = apicache.middleware;

const phishingController = require("../../controllers/phishingController");

//router innitialisation
const router = express.Router();

//routing table
router.route('/').get((req, res) => {
    res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
  });

router.get("/status", phishingController.getStatus);

router.post("/analyse", phishingController.analyseData);
//using name allows caching
router.post("/analyse:name", cache("5 minutes"), phishingController.analyseData);

//router finalisation
module.exports = router;