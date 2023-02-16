require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// SERVER
const app = express();

// DATABASE
dbConnection();

// CORS
app.use(cors());

// ROUTES
app.get("/", (request, response) => {
	response.status(200).json({
		ok: true,
		msg: "Hello World",
	});
});

// SERVER PORT
app.listen(process.env.PORT, () => {
	console.log("Server running in port: " + process.env.PORT);
});
