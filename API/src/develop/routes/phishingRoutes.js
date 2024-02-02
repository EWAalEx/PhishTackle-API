//Dependencies
const express = require("express");
const apicache = require("apicache");

const phishingController = require("../../controllers/phishingController");

//innit caching
const cache = apicache.middleware;
//add cache(TIME) as parameter to request to cache result

//router innitialisation
const router = express.Router();

//routing table
router.get("/status", phishingController.getStatus);

router.get("/", phishingController.getAllData);

router.get("/:dataId", phishingController.getOneData);

router.post("/", phishingController.createNewData);

router.patch("/:dataId", phishingController.updateOneData);

router.delete("/:dataId", phishingController.deleteOneData);

//router finalisation
module.exports = router;