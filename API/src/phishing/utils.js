//machine learning model locations
const text_model_url = "API/src/models/sklearn_text_model_Strip_Unicode.onnx"; //optimised model
const url_model_url = "API/src/models/sklearn_url_model_Strip_unicode_ng2.onnx"; //optimised model

//export util functions
module.exports = { 
  text_model_url, 
  url_model_url 
};