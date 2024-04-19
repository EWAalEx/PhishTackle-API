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
  return model;
};

async function analyseTextModel(text_model, newData){
  let error = "";

  //run models against provided inputs
  if (text_model){
    //when model is loaded run provided data through prediction
    const input_text = [newData.content];
    let predictions = [];
    let certaintys = [];

    //itterate through text in input_texts
    for (let text in input_text){
      //create new feed for new url
      let text_data = new ort.Tensor("string", [input_text[text]]);
      let feeds = {"text_input": text_data};

      try {
        let results = await text_model.run(feeds);
          
        //split results into 2 values for analysis
        prediction = results.label.cpuData[0];
        certainty = results.probabilities.cpuData;

        //update list outside loop with new url data
        predictions.push(prediction);
        certaintys.push(certainty);
        
      } catch (error){
        error = `failed to inference ONNX model: ${error}.`;
        console.log(`failed to inference ONNX model: ${error}.`);
        predictions = ["Text Model Failure"];
        return [predictions, certaintys, error];
      };
    }
    //function completed successfully returns here
    return [predictions, certaintys, error];

  }else{
    //model not loaded but function called, throw error
    error = "Text Model couldnt load!";
    console.log("Text Model couldnt load!");
    predictions = ["Text Model Failure"];
    return [predictions, certaintys, error];
  }
}

async function analyseUrlModel(url_model, newData){
  let error = "";

  //run models against provided inputs
  if (url_model){
    const input_urls = newData.urls;
    let predictions = [];
    let certaintys = [];
    
    //when model is loaded run provided data through prediction
    //itterate through the urls provided and construct arrays to do final analysis on later
    for(let url in input_urls){
      //create new feed for new url
      let url_data = new ort.Tensor("string", [input_urls[url]]);
      let feeds = {"text_input": url_data};

      try {
        //analyse feeds
        let results = await url_model.run(feeds);
        
        //split results into 2 values for analysis
        prediction = results.label.cpuData[0];
        certainty = results.probabilities.cpuData;

        //update list outside loop with new url data
        predictions.push(prediction);
        certaintys.push(certainty);
        
      } catch (error){
        error = `failed to inference ONNX model: ${error}.`;
        console.log(`failed to inference ONNX model: ${error}.`);
        predictions = ["Url Model Failure"];
        return [predictions, certaintys, error];
      };
    }
    //function completed successfully returns here
    return [predictions, certaintys, error];
    
  }else{
    //model not loaded but function called, throw error
    error = "Url Model couldnt load!";
    console.log("Url Model couldnt load!");
    predictions = ["Url Model Failure"];
    return [predictions, certaintys, error];
  }
}

async function sendForAnalysis(newData){
  //only load models that are needed
  //loading text model
  const url_text = "C:/Users/alexe/Downloads/Phishing_Text/sklearn_text_model.onnx";
  let text_model = null;
  if (url_text != "" && (newData.content != "") && (newData.content.trim() != "")){
    text_model = await loadModel(url_text);
  }

  //loading url model
  const url_urls = "C:/Users/alexe/Downloads/Phishing_URLS_dataset/sklearn_url_model.onnx";
  let url_model = null;
  if (url_urls != "" && newData.urls != "" && newData.urls != []){
    url_model = await loadModel(url_urls);
  }

  //if models arent loaded dont try to use them
  //analysing text
  let text_predictions = new Array();
  let text_certaintys = new Array();
  let text_error = "";
  
  if (text_model != null){
    [text_predictions, text_certaintys, text_error] = await analyseTextModel(text_model, newData);
  }

  //analysing urls
  let url_predictions = new Array();
  let url_certaintys  = new Array();
  let url_error = "";

  if (url_model != null){
    [url_predictions, url_certaintys, url_error] = await analyseUrlModel(url_model, newData);
  }

  //process text and url responses
  let analysis_certainty = 0.0;

  //if both data provided
  if (text_model && url_model){

    let val_count = 0
  
    //if any of the models said a phishing email, return phishing email to be sure
    if(text_predictions.includes("Phishing Email") || url_predictions.includes("Phishing Email")){
      newData.tag = "Phishing Email";

      //since we know the data is phishing we only need the phishing certainty of all the model outputs
      for (let certainty in url_certaintys){
        analysis_certainty += url_certaintys[certainty][0];
        val_count += 1;
      }
      for (let certainty in text_certaintys){
        analysis_certainty += text_certaintys[certainty][0];
        val_count += 1;
      }

    }else {
      newData.tag = text_predictions[0];

      //since we know the data isnt phishing we only need the safe certainty of all the model outputs
      for (let certainty in url_certaintys){
        analysis_certainty += url_certaintys[certainty][1];
        val_count += 1;
      }
      for (let certainty in text_certaintys){
        analysis_certainty += text_certaintys[certainty][1];
        val_count += 1;
      }
    }
    //calculate average
    analysis_certainty = analysis_certainty/val_count;
  }
  //if only text provided
  else if(text_model){
  
    let val_count = 0;

    //if any of the models said a phishing email, return phishing email to be sure
    if(text_predictions.includes("Phishing Email")){
      newData.tag = "Phishing Email";

      //since we know the data is phishing we only need the phishing certainty of all the model outputs
      for (let certainty in text_certaintys){
        analysis_certainty += text_certaintys[certainty][0];
        val_count += 1;
      }
    }else {
      newData.tag = text_predictions[0];

      //since we know the data isnt phishing we only need the safe certainty of all the model outputs
      for (let certainty in text_certaintys){
        analysis_certainty += text_certaintys[certainty][1];
        val_count += 1;
      }
    }

    analysis_certainty = analysis_certainty/val_count;

  }
  //if only urls provided
  else{
  
    let val_count = 0

    //if any of the models said a phishing email, return phishing email to be sure
    if(url_predictions.includes("Phishing Email")){
      newData.tag = "Phishing Email";

      //since we know the data is phishing we only need the phishing certainty of all the model outputs
      for (let certainty in url_certaintys){
        analysis_certainty += url_certaintys[certainty][0];
        val_count += 1;
      }

    }else {
      newData.tag = url_predictions[0];

      //since we know the data isnt phishing we only need the safe certainty of all the model outputs
      for (let certainty in url_certaintys){
        analysis_certainty += url_certaintys[certainty][1];
        val_count += 1;
      }
    }
    //calculate average
    analysis_certainty = analysis_certainty/val_count;
  }

  return [newData, analysis_certainty, text_error, url_error];
}

const analyseData = async (newData) => {
  try{

    const [analysedData, certainty, text_error, url_error] = await sendForAnalysis(newData);

    //send data to ML algorithms for analysis

    if (newData.tag == "Text Model Failure"){
      throw { status: 500, message: text_error };
    }

    if (newData.tag == "Url Model Failure"){
      throw { status: 500, message: url_error };
    }

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