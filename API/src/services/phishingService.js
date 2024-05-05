//Dependencies
const Phishing = require("../phishing/phishing");
const { v4: uuid } = require("uuid");

const analyseData = async (newData) => {
    //create data object
    id = uuid();

    newData.name = id;

    const dataToInsert = {
        id: id,
        ...newData,
    };

    //send created object to database controller
    try {
        const [analysedData, certainty] = await Phishing.analyseData(dataToInsert);

        const resultantData = {
            ...analysedData,
            certainty: certainty,
            createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        }

        return resultantData;
    } catch (error) {
        throw error;
    }

};

//export created methods
module.exports = {
    analyseData,
};