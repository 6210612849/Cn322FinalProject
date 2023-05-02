const express = require("express");
const router = express.Router();
const {
  sendVerificationOTPEmail,
  verifyUserEmail,
} = require("./controller");

router.get("/verify", async (req, res) => {
  res.render("verify-email");
});

// request new verification otp
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) throw Error("An email is required!");

    const createdEmailVerificationOTP = await sendVerificationOTPEmail(email);
    res.status(200).json(createdEmailVerificationOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!(email && otp)) throw Error("Empty otp details are not allowed");

    const temp = await verifyUserEmail({ email, otp });
    if (temp == true) {
      res.status(200).send(true)
    }
    else {
      res.status(400).send(false)
    }

    //res.status(200).json({ email, verified: true });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
