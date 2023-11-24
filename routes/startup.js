const router = require("express").Router();
const User = require("../models/User");
const auth = require("./authMiddleware");

router.use(auth);
router.use(async (req, res, next) => {
  req.user = await User.findById(req.session.user.id);
  next();
});

router.get("/", async (req, res) => {
  const user = req.user;
  const startup = user.info;
  res.render("startups/index", {
    startup,
  });
});

// Display form for editing an existing startup
router.get("/edit", async (req, res) => {
  const user = req.user;
  const startup = user.info;
  res.render("startups/edit-form", { startup });
});

// Handle updating an existing startup
router.post("/edit", async (req, res) => {
  const user = req.user;
  user.info = req.body;
  await user.save();
  res.redirect("/dashboard");
});

module.exports = router;
