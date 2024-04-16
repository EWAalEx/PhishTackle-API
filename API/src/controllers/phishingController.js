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

const getAllData = (req, res) => {
    try {
        const allData = phishingService.getAllData();
        res.send({ status: "OK", data: allData });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }

};

const getOneData = (req, res) => {
    const {
        params: { dataId },
    } = req;
    if (!dataId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: "Parameter ':dataId' can not be empty" },
            });
    }

    try {
        const data = phishingService.getOneData(dataId);
        res.send({ status: "OK", data: data });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

const createNewData = (req, res) => {
    const { body } = req;
    //validate data
    if (
        !body.name ||
        !body.urls ||
        !body.content ||
        !body.tag
    ) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'name', 'urls', 'content', 'tag'",
                },
            });
        return;
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
        const createdData = phishingService.createNewData(newData);
        res.status(201).send({ status: "OK", data: createdData });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }

};

const updateOneData = (req, res) => {
    const {
        body,
        params: { dataId },
    } = req;
    if (!dataId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: "Parameter ':dataId' can not be empty" },
            });
    }
    try {
        const updatedData = phishingService.updateOneData(dataId, body);
        res.send({ status: "OK", data: updatedData });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }

};

const deleteOneData = (req, res) => {
    const {
        params: { dataId },
    } = req;
    if (!dataId) {
        res
            .status(400)
            .send({
                status: "FAILED",
                data: { error: "Parameter ':dataId' can not be empty" },
            });
    }

    try {
        phishingService.deleteOneData(dataId);
        res.status(200).send({ status: "OK", data: `DataID ${dataId} successfully deleted` });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

const analyseData = async (req, res) => {
    const { body } = req;

    if((!body.content && !body.urls) || (body.content.trim() == "" && body.urls == "")) {
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
    getAllData,
    getOneData,
    createNewData,
    updateOneData,
    deleteOneData,
    analyseData,
};