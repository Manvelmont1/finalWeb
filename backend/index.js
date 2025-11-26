'use strict';

let mongoose = require("mongoose");
let application = require("./application");

// Conexion a mongoDB:
mongoose.connect("mongodb://localhost:27017/reviews_db").then(
    () => {
        console.log("DB connection OK");
        application.listen(2608);
    },
    err => {
        console.error(err);
    }
);
