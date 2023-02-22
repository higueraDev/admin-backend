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

//PUBLIC
app.use(express.static('public'))

// READ_BODY
app.use(express.json());

// ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/physicians", require("./routes/physicians"))
app.use("/api/search", require("./routes/search"))
app.use("/api/upload", require("./routes/upload"))
app.use("/api/download", require("./routes/download"))

// SERVER PORT
app.listen(process.env.PORT, () => {
	console.log("Server running in port: " + process.env.PORT);
});
