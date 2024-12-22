const express = require("express")
const app = express()
const db = require("./models")
app.set('view engine', 'ejs')
app.use(express.json())

const userRouter = require("./routesAndControllers/homeRoutes")
const authRouter = require("./routesAndControllers/authRoutes")

app.use("/home", userRouter)
app.use("/auth", authRouter)

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
