//Dependencies
const fs = require("fs");

const saveToDatabase = (DB) => {
  console.log(DB);
  try{
    fs.writeFileSync("./API/src/database/db.json", JSON.stringify(DB, null, 4), {
      encoding: "utf-8",
    });
  }catch (error) {
    throw { status: 500, message: error?.message || error };
  }
};

//export util functions
module.exports = { saveToDatabase };