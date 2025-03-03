const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const userRoute = require("./src/routes/user.route.js");
const noteRoute = require("./src/routes/note.route.js");

// Fix typo: dotenv.config()
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to the database
connectDB();

// Routes;
app.use("/api/users", userRoute);
app.use("/api/notes", noteRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
