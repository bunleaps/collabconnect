const router = require("express").Router();
const AuthRouter = require("./auth");
const StartUpRouter = require("./startup");
const User = require("../models/User");
const auth = require("./authMiddleware");

router.use("/auth", AuthRouter);
router.use("/startup", StartUpRouter);

router.get("/", (req, res) => {
  res.render("home");
});

router.use(auth);
router.use(async (req, res, next) => {
  req.user = await User.findById(req.session.user.id);
  next();
});

router.get("/dashboard", (req, res) => {
  const user = req.user;
  const startup = user.info;
  res.render("dashboard", { user, startup });
});

module.exports = router;
