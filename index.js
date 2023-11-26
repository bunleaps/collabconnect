require("dotenv").config();
const express = require("express");
const mongoose = require("./db/connection");
const { log } = require("mercedlogger");
const path = require("path");
// const livereload = require("livereload");
// const connectLivereload = require("connect-livereload");

const methodOverride = require("method-override");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || "2021";
const SECRET = process.env.SECRET || "secret";
const HomeRouter = require("./routes/home.js");

const session = require("express-session"); // create session cookies
const connect = require("connect-mongodb-session")(session); // store cookies in mongo

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, "public"));
// app.use(connectLivereload());

// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

app.use(cors()); // Prevent Cors Errors if building an API
app.use(methodOverride("_method")); // Swap method of requests with _method query
app.use(express.static(path.join(__dirname + "/public"))); // serve the public folder as static
app.use(morgan("tiny")); // Request Logging
app.use(express.json()); // Parse json bodies
app.use(express.urlencoded({ extended: false })); //parse bodies from form submissions
// SESSION MIDDLEWARE REGISTRATION (adds req.session property)
app.use(
  session({
    secret: SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    saveUninitialized: true, // create session regardless of changes
    resave: true, //save regardless of changes
    store: new connect({
      uri: process.env.MONGODB_URL,
      databaseName: "sessions",
      collection: "sessions",
    }),
  })
);

app.use("/", HomeRouter);

app.listen(PORT, () =>
  log.white("🚀 Server Launch 🚀", `Listening on Port ${PORT}`)
);
