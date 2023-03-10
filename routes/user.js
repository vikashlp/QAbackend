const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),

  password: Joi.string().required().min(5).max(10),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  accesslevel: Joi.string().required(),
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let tester = await User.findOne({ email: req.body.email });
  if (tester) return res.status(400).send("User already registered");

  try {
    tester = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      accesslevel: req.body.accesslevel,
    });

    const salt = await bcrypt.genSalt(10);
    tester.password = await bcrypt.hash(tester.password, salt);

    let Testery = await tester.save();
    res.send(Testery);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
