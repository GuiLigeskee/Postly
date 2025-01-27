const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// Models
const Postly = require("./models/Post");
const User = require("./models/User");

// Routes
const postlyRoutes = require("./routes/postlyRoutes");
const authRoutes = require("./routes/authRoutes");

// Controllers
const PostlyController = require("./controllers/PostlyController");

// Template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// session middleware
app.use(
  session({
    name: "session",
    secret: "nosso-secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true, // não funciona com https, teria que mudar a configuração
    },
  })
);

// flash messages
app.use(flash());

// public path
app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});

// Routes
app.use("/postly", postlyRoutes);
app.use("/", authRoutes);

app.get("/", PostlyController.showAllPosts);

conn
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
