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
  //ensures data is not already in database
  const AlreadyExists =
    DB.data.findIndex((data) => data.name === newData.name) > -1;
  if (AlreadyExists) {
    throw {
      status: 400,
      message: `Data with the name '${newData.name}' already exists`,
    };
  }

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
    const isAlreadyAdded =
      DB.data.findIndex((data) => data.name === changes.name) > -1;
    if (isAlreadyAdded) {
      throw {
        status: 400,
        message: `Data with the name '${changes.name}' already exists`,
      };
    }
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

//export created fucntions
module.exports = {
  getAllData,
  createNewData,
  getOneData,
  updateOneData,
  deleteOneData,
};