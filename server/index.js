const express = require("express")
const app = express()

const db = require("./models")

const userRouter = require("./routesAndControllers/homeRoutes")
app.use("/home", userRouter)

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
