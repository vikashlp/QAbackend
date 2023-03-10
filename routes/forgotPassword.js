const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  password: Joi.string().required().min(5).max(10),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email ");

  const salt = await bcrypt.genSalt(10);
  hashpassword = await bcrypt.hash(req.body.password, salt);

  const updatePassword = await User.updateOne(
    { email: req.body.email },
    { $set: { password: hashpassword } }
  );
  if (!updatePassword)
    return res.status(404).send("Error occured while updating password");

  res.status(200).send("Password Updated successfully");
});

module.exports = router;
