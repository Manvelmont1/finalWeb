'use strict';

let express = require("express");
let bodyParser = require("body-parser");
let routerUsers = require("./routes/users");
let routerReviews = require("./routes/reviews");
let cors = require("cors");

let application = express();

application.use(cors());
application.use(bodyParser.json());
application.use(routerUsers);
application.use(routerReviews);

module.exports = application;
