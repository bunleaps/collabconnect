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
  const startup = user.info; // Assuming 'info' contains the startup information

  // Assuming 'req.body' contains the updated fields, including 'categories'
  const { name, founder, website, address, image, categories } = req.body;

  // Split categories string into an array
  const categoriesArray = categories
    .split(",")
    .map((category) => category.trim());

  // Update the startup information
  startup.name = name;
  startup.founder = founder;
  startup.website = website;
  startup.address = address;
  startup.image = image;
  startup.categories = categoriesArray;

  // Save the user with the updated startup information
  await user.save();
  res.redirect("/dashboard");
});

module.exports = router;
