const { model, Schema } = require("../db/connection");

const StartUp = new Schema({
  name: String,
  founder: String,
  address: String,
  website: String,
  image: String,
});

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    info: {
      type: StartUp,
      default: {
        name: "",
        founder: "",
        address: "",
        website: "",
        image: "",
      },
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = User;
