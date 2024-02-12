//Dependencies
const DB = require("../database/db.json");
const Phishing = require("../database/phishing");
const { v4: uuid } = require("uuid");

const getAllData = () => {
    try {
        const allData = Phishing.getAllData();
        return allData;
    } catch (error) {
        throw error;
    }

};

const getOneData = (dataId) => {
    try {
        const data = Phishing.getOneData(dataId);
        return data;
    } catch (error) {
        throw error;
    }


};

const createNewData = (newData) => {
    //create data object
    id = uuid()
    while ( DB.data.findIndex((data) => data.id === id) > -1) {
        id = uuid();
    }

    const dataToInsert = {
        id: id,
        ...newData,
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };

    //send created object to database controller
    try {
        const createdData = Phishing.createNewData(dataToInsert);
        return createdData;
    } catch (error) {
        throw error;
    }

};

const updateOneData = (dataId, changes) => {
    try {
        const updatedData = Phishing.updateOneData(dataId, changes);
        return updatedData;
    } catch (error) {
        throw error;
    }


};

const deleteOneData = (dataId) => {
    try {
        Phishing.deleteOneData(dataId);
    } catch (error) {
        throw error;
    }
};

const analyseData = (newData) => {
    //create data object
    id = uuid()
    while ( DB.data.findIndex((data) => data.id === id) > -1) {
        id = uuid();
    }

    const dataToInsert = {
        id: id,
        ...newData,
    };

    //send created object to database controller
    try {
        const [analysedData, certainty] = Phishing.analyseData(dataToInsert);

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
    getAllData,
    getOneData,
    createNewData,
    updateOneData,
    deleteOneData,
    analyseData,
};