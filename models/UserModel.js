import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email field is missing"],
    lowercase: true,
    validate: [validator.isEmail, "Email is not valid"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password field is missing"],
    minlength: [8, "Password field is to short"],
    // select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Please confirm your passowrd"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "password does not match",
  },
  // hasChanged:Date,
  roles:{
    type:String,
    enum:["admin","user","staff"],
    default:"user"
  },
  PassswordresetToken:{
    type:String, 
  },
  resetTimer:Date

});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  inputpassword,
  hashedpassword
) {
  const isCorrect = await bcrypt.compare(inputpassword, hashedpassword);
  return isCorrect;
};

userSchema.methods.generateResetLink= function(){
  const resetToken = crypto.randomBytes(32).toString("hex")
  const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  console.log(passwordResetToken)
  this.PassswordresetToken = passwordResetToken;
  this.resetTimer = Date.now() + 10 *60 * 1000
  return resetToken
}

export const TourUser = mongoose.model("TourUser", userSchema);
