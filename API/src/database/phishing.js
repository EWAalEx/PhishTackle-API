//Dependencies
const DB = require("./db.json");
const { saveToDatabase } = require("./utils");

const getAllData = () => {
  try {
    return DB.data;
  } catch (error) {
    throw { status: 500, message: error };
  }

};

const getOneData = (dataId) => {
  try{
    const data = DB.data.find((data) => data.id === dataId);
    if (!data) {
      throw {
        status: 400,
        message: `data with the id '${dataId}' does not exist`,
      };
    }
    return data;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
  
};

const createNewData = (newData) => {
  try {
    DB.data.push(newData);

    //update database with new data
    saveToDatabase(DB);
    return newData;
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

const updateOneData = (dataId, changes) => {
  try {
    const indexForUpdate = DB.data.findIndex(
      (data) => data.id === dataId
    );
    if (indexForUpdate === -1) {
      throw {
        status: 400,
        message: `Can't find data with the id '${dataId}'`,
      };
    }
    const updatedData = {
      ...DB.data[indexForUpdate],
      ...changes,
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    DB.data[indexForUpdate] = updatedData;
    saveToDatabase(DB);
    return updatedData;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }  
};

const deleteOneData = (dataId) => {
  try{
    const indexToDelete = DB.data.findIndex(
      (data) => data.id === dataId
    );
    if (indexToDelete === -1) {
      throw {
        status: 400,
        message: `Can't find data with the id '${dataId}'`,
      };
    }
    DB.data.splice(indexToDelete, 1);
    saveToDatabase(DB);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const analyseData = (newData) => {
  try {
    //send data to ML algorithms for analysis
    let [analysedData, certainty] = (function(newData) {
      //right now replicates a value between 1 and 2
      //plan to have both ML algorithms produce a value
      //create a mean for the resultant certainty
      let certainty = Math.random();

      //fake logic that states phishing if certainty is above 0.4/1
      if (certainty > 0.4) {
        newData.tag = "Phishing";
      } else {
        newData.tag = "Begnin";
      }

      return [newData, certainty];
    })(newData);

    return [analysedData, certainty];
  } catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

//export created fucntions
module.exports = {
  getAllData,
  createNewData,
  getOneData,
  updateOneData,
  deleteOneData,
  analyseData,
};