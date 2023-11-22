const mongoose = require("./connection");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seed = async () => {
  // mongoose.connection.db.dropDatabase();

  const newUser = {
    username: "bunleapsorn",
    password: await bcrypt.hash("cheese", await bcrypt.genSalt(10)),
  };

  const user = await User.create(newUser);

  console.log(user);

  mongoose.disconnect();
};

mongoose.connection.on("open", () => {
  seed();
});
