//Dependencies
const phishingService = require("../services/phishingService");

const getStatus = (req, res) => {
    try {
        res.send({status: "OK", data: "Phishing API running as normal"});
    } catch (error) {
        res.status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

const analyseData = async (req, res) => {
    const { body } = req;
    if((!body.content && !body.urls) || (body.content == "" && body.urls == "")) {
        return res
            .status(400)
            .send({ status: "FAILED", data: { error: "Empty Data Sent" } });
    }

    //validate data
    if (!body.name) {
        body.name = "";
    }

    if (!body.tag) {
        body.tag = "Test"
    }
    //create data object from JSON body
    const newData = {
        name: body.name,
        urls: body.urls,
        content: body.content,
        tag: body.tag,
    };

    //send data to service layer to process
    try {
        const analysedData = await phishingService.analyseData(newData);
        res.status(201).send({ status: "OK", data: analysedData });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }

};

//export created functions
module.exports = {
    getStatus,
    analyseData,
};