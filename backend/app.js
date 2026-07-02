const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", listingRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("CampusBazaar API is running");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;