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
  req.query = req.query || {};
  next();
});

router.get("/dashboard", (req, res) => {
  const user = req.user;
  const startup = user.info;
  res.render("dashboard", { user, startup });
});

router.get("/search", async (req, res) => {
  try {
    // Fetch data and pass it to the EJS template
    const user = await User.findById(req.session.user.id);
    let startups = await User.find({ _id: { $ne: user._id } });

    // Get the search query from req.query
    const searchQuery = req.query.name || "";
    const categoryQuery = req.query.category || "";

    console.log("Startups (before filtering):", startups);

    // Filter startups based on the search query
    if (searchQuery || categoryQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      const categoryRegex = new RegExp(categoryQuery, "i");

      startups = startups.filter((startup) => {
        const nameMatch = startup.info && searchRegex.test(startup.info.name);
        const categoryMatch =
          startup.info &&
          startup.info.categories.some((category) =>
            categoryRegex.test(category)
          );

        return (
          (searchQuery ? nameMatch : true) &&
          (categoryQuery ? categoryMatch : true)
        );
      });
    }

    console.log("Startups (after filtering):", startups);

    res.render("search", { user, startups, searchQuery, categoryQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
