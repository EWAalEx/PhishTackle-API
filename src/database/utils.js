//Dependencies
const fs = require("fs");

const saveToDatabase = (DB) => {
  fs.writeFileSync("./src/database/db.json", JSON.stringify(DB, null, 4), {
    encoding: "utf-8",
  });
};

//export util functions
module.exports = { saveToDatabase };