const APIURl = "http://localhost:3000/api/develop/phishing";
const exampleID = "61dbae02-c147-4e28-863c-db7bd402b2d6";
const exampleData = {
    "name": "Test Data 3",
    "info": "For Testing API request functionality",
    "urls": [
        "example@email.com",
        "https://www.google.com",
        "https://random.io"
    ],
    "content": "Lorem ipsum sit dolors amet",
    "tag": "Begnin"
};

//retrieve API status on load
async function apiRunning() {
    try {
      document.querySelector("#status").innerHTML = "Retrieving API Status...";
      const data = await getData(`${APIURl}/status`);
      document.querySelector("#status").innerHTML = data.data;
    } catch (error){
      document.querySelector("#status").innerHTML = "API Unavaliable";
    }
    
}

apiRunning();

//GET
async function getData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  });
  return response.json();
}

function getStatus() {
  getData(`${APIURl}/status`)
  .then((data) => {
    document.getElementById("response").innerHTML = JSON.stringify(data)
    console.log(data);
  });
}

function getAllData() {
    getData(APIURl)
    .then((data) => {
        document.getElementById("response").innerHTML = JSON.stringify(data)
        console.log(data);
      });
}

function getSpecificData(id = exampleID) {
    getData(`${APIURl}/${id}`)
    .then((data) => {
        document.getElementById("response").innerHTML = JSON.stringify(data)
        console.log(data);
      });
}

//POST
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function postNewData(data = exampleData) {
  postData(`${APIURl}`, data)
  .then((data) => {
    document.getElementById("response").innerHTML = JSON.stringify(data)
    console.log(data);
  });
}

//PATCH
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function patchOldData(id = exampleID, data = exampleData) {
  postData(`${APIURl}/${id}`, data)
  .then((data) => {
    document.getElementById("response").innerHTML = JSON.stringify(data)
    console.log(data);
  });
}

//DELETE
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function deleteData(id = exampleID) {
  postData(`${APIURl}/${id}`, {})
  .then((data) => {
    document.getElementById("response").innerHTML = JSON.stringify(data)
    console.log(data);
  });
}