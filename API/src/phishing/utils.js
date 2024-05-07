//machine learning model locations
//optimised model
const text_model_url = "API/src/models/sklearn_text_model_Strip_Unicode.onnx";
//base model, heroku cannot run the optimised model for memory issues
const url_model_url = "API/src/models/sklearn_url_model_CNB.onnx"; 

//export util functions
module.exports = { 
  text_model_url, 
  url_model_url 
};