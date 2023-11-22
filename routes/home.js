const router = require("express").Router();
const AuthRouter = require("./auth");
const auth = require("./authMiddleware");

router.use("/auth", AuthRouter);

router.get("/", (req, res) => {
  res.render("home");
});

router.use(auth);

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
