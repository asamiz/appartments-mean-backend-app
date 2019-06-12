const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  creation_dt: { type: Date, require: true }
});

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.isValid = function(hashedPassword) {
  return bcrypt.compareSync(hashedPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
