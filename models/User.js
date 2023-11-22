const { model, Schema } = require("../db/connection");

const StartUp = new Schema({
  name: String,
  founders: [String],
  address: String,
  website: String,
});

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    info: StartUp,
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
