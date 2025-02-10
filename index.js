const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

const port = process.env.PORT;

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
const sessionStore = new (require("memorystore")(session))({
  checkPeriod: 86400000, // 24 horas
});

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "segredo-padrao",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Usando HTTPS em produção
      maxAge: 3600000, // 1 hora
      httpOnly: true,
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
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
