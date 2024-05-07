//Dependencies
const { text_model_url, url_model_url } = require("./utils");
const ort = require("onnxruntime-node");

async function loadModel(url = ""){
  const model = await ort.InferenceSession.create(url);
  return model;
};

async function analyseTextModel(text_model, newData){
  let error = "";

  //run models against provided inputs
  if (text_model){
    //when model is loaded run provided data through prediction
    let input_text = newData.content;

    if(typeof(input_text) == "string"){
      input_text = [newData.content];
    }

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
    let input_urls = newData.urls;

    if(typeof(input_urls) == "string"){
      input_urls = [newData.urls];
    }

    let predictions = [];
    let certaintys = [];
    
    //when model is loaded run provided data through prediction
    //itterate through the urls provided and construct arrays to do final analysis on later
    for(let url in input_urls){
      //create new feed for new url
      let url_data = new ort.Tensor("string", [input_urls[url]]);
      let feeds = {"url_input": url_data};

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
  let text_model = null;
  if (text_model_url != "" && newData.content != "" && newData.content != [""]){
    text_model = await loadModel(text_model_url);
  }

  //loading url model
  let url_model = null;
  if (url_model_url != "" && newData.urls != "" && newData.urls != []){
    url_model = await loadModel(url_model_url);
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
  analyseData
};