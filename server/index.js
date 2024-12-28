const express = require("express")
const app = express()
const cors = require("cors")
const db = require("./models")
var Sequelize = require("sequelize")
var session = require("express-session")
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env]
app.set('view engine', 'ejs')
var SequelizeStore = require("connect-session-sequelize")(session.Store)

async function main() {
  var sequelize = new Sequelize(config["database"], config["username"], config["password"], {
    dialect: "mysql",
    storage: "./session.sqlite",
  })

  app.use(express.json())
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
  }))
  var myStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 24 * 60 * 60 * 1000
  });
  const IN_PROD = process.env.NODE_ENV === 'production'
  app.use(
    session({
      secret: "keyboard cat",
      store: myStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: true,
        secure: IN_PROD
      },
    })
  );
  await myStore.sync()

  const homeRouter = require("./routesAndControllers/homeRoutes")
  const authRouter = require("./routesAndControllers/authRoutes")
  const postRouter = require("./routesAndControllers/postRoutes")

  app.use("/home", homeRouter)
  app.use("/auth", authRouter)
  app.use("/post", postRouter)

  app.use((err, req, res, next) => {
    console.log("Error middleware")
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
      message: "Something went wrong",
    });
  })

  db.sequelize.sync().then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000")
    })
  })
}

main().catch((err) => {
  console.log(err)
})