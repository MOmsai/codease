const express = require("express");
const cors = require("cors");

const contactRoutes = require("./routes/contact_routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);

module.exports = app;
