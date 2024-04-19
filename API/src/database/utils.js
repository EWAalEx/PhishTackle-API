//Dependencies
const fs = require("fs");

const saveToDatabase = (DB) => {
  try{
    fs.writeFileSync("./API/src/database/db.json", JSON.stringify(DB, null, 4), {
      encoding: "utf-8",
    });
  }catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

//machine learning model locations
const text_model_url = "API/src/models/sklearn_text_model.onnx";
const url_model_url = "API/src/models/sklearn_url_model.onnx";

//export util functions
module.exports = { saveToDatabase, text_model_url, url_model_url };