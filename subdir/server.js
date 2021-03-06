const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

//connection to database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

///Routers
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const projectsRouter = require("./routes/projects");
app.use("/projects", projectsRouter);

const tasksRouter = require("./routes/tasks");
app.use("/tasks", tasksRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

const registrRouter = require("./routes/registr");
app.use("/register", registrRouter);

const confirmRouter = require("./routes/confirmation");
app.use("/confirmation", confirmRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
