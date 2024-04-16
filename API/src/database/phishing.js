//Dependencies
const DB = require("./db.json");
const { saveToDatabase } = require("./utils");

const ort = require("onnxruntime-node");

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

async function loadModel(url = ""){
  const model = await ort.InferenceSession.create(url);
  console.log("session created");
  return model;
};

async function analyseTextModel(text_model, newData){
  let error = "";

  if (text_model){
    const input_text = [newData.content];
    const text_data = new ort.Tensor("string", input_text);
    const feeds = {"text_input": text_data};
    
    //when model is loaded run provided data through prediction

    try {
      let results = await text_model.run(feeds);
        
      text_prediction = results.label.cpuData[0];
      text_certainty = results.probabilities.cpuData;

      if (text_prediction === "Phishing Email"){
        text_certainty = text_certainty[0];
      }else {
        text_certainty = text_certainty[1];
      }

      console.log("Prediction:", text_prediction);
      console.log("Probability:", text_certainty);
      
    } catch (error){
      //change for a throw statement explaining the model error
      error = `failed to inference ONNX model: ${error}.`;
      console.log(`failed to inference ONNX model: ${error}.`);
      text_prediction = "Text Model Failure";
      return [text_prediction, text_certainty, error];
    };
  }else{
    error = "Text Model couldnt load!";
    console.log("Text Model couldnt load!");
    text_prediction = "Text Model Failure";
    return [text_prediction, text_certainty, error];
  }

  return [text_prediction, text_certainty, error];
}

async function sendForAnalysis(newData){
  const url_text = "C:/Users/alexe/Downloads/Phishing_Text/sklearn_text_model.onnx";
  const text_model = await loadModel(url_text);
  //url_model = loadModel("file://C:/Users/alexe/Downloads/Phishing_Text/model.onnx");

  const [text_prediction, text_certainty, text_error] = await analyseTextModel(text_model, newData);

  let analysis_certainty = 0.0;

  console.log("text_certainty", text_certainty);
  
  analysis_certainty = text_certainty;

  console.log("text_prediction", text_prediction);

  newData.tag = text_prediction;

  return [newData, analysis_certainty, text_error];
}

const analyseData = async (newData) => {
  try{

    const [analysedData, certainty, text_error] = await sendForAnalysis(newData);

    //send data to ML algorithms for analysis

    if (newData.tag == "Text Model Failure"){
      throw { status: 500, message: text_error };
    }

    console.log("returning:\nanalysedData:", analysedData, "\nCertainty:", certainty);
    return [analysedData, certainty];

  }catch (error){
    console.log("error",error);
  };
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