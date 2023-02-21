require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// DATABASE
dbConnection();

// SERVER
const app = express();

// CORS
app.use(cors());

// READ_BODY
app.use(express.json());

// ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/auth"));

// SERVER PORT
app.listen(process.env.PORT, () => {
	console.log("Server running in port: " + process.env.PORT);
});
