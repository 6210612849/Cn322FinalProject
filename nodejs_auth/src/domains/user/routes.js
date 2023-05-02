const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail, } = require("./../email_verification/controller");
const jwt = require('jsonwebtoken');
// add the jwt secret key to your environment variables
// Decode the Base32-encoded secret key

const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Token = require("./token-model");


router.get("/", function (req, res) {
    res.render("home");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

//Handling user logout 
router.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

router.post('/login', async (req, res) => {
    try {
        let { email, password, token } = req.body;
        //const email = await User.findOne({ email });
        email = email.trim();
        password = password.trim();
        token = token.trim();

        if (!(email && password && token)) {
            throw Error('Empty credentials supplied');
        }

        const authenticatedUser = await authenticateUser({ email, password });

        // Verify the TOTP token
        const isValidToken = speakeasy.totp.verify({
            secret: authenticatedUser.secret,

            //why not endoding?
            //encoding: 'base32',
            token,
            window: 1,
        });

        if (!isValidToken) {
            return res.status(401).send({ message: 'Invalid Token' });
        }

        // login สำเร็จ
        // res.send({ message: token });
        // generate a JWT token with user's data
        // const jwttoken = jwt.sign({ id: authenticatedUser.id, email: authenticatedUser.email }, secretKey, {
        //   expiresIn: '1h' // set the expiration time of the token
        // });
        // res.render('secret', { token });
        // send the token to the client
        res.status(200).send(authenticatedUser.token);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//Signup
router.post("/register", async (req, res) => {
    try {

        let { name, email, password } = req.body;
        console.log(name, email, password)
        name = name.trim();
        email = email.trim();
        password = password.trim();

        if (!(name && email && password)) {
            throw Error("Empty input fields!");
        } else if (!/^[a-zA-Z ]*$/.test(name)) {
            throw Error("Invalid name entered!");
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw Error("Invalid email entered!");
        } else if (password.length < 8) {
            throw Error("Password must be at least 8 characters");

        } else {
            // Generate a TOTP secret for the user
            const secret = speakeasy.generateSecret({ length: 20 }).base32;
            //good create new user
            const newUser = await createNewUser({
                name,
                email,
                password,
                secret,
            });
            await sendVerificationOTPEmail(email);

            // Generate a QR code for the user to scan
            const otpauthUrl = speakeasy.otpauthURL({
                secret,
                ///// ใช้ name หรือ email อันไหนก็ได้มันได้หมด ไว้เเสดงบนเเอป
                label: email,
                issuer: '2FA Demo',
            });
            const qrCode = await qrcode.toDataURL(otpauthUrl);
            var img = Buffer.from(qrCode, 'base64');
            console.log(qrCode)
            // Send the QR code to the client
            // res.render("qrCode", { qrCode });
            res.status(200).send(qrCode)

            //res.render("verify-email")
            //res.status(200).json(newUser);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/checkToken", async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            throw Error("no token")
        }
        const decoded = jwt.decode(token);
        const expiresAt = decoded.exp;
        console.log(Date.now(), expiresAt * 1000)
        const isExpired = Date.now() <= (expiresAt * 1000);
        if (!isExpired) {
            throw Error("token expired")
        }
        const myToken = await Token.findOne({ token })
        if (!myToken) {
            throw Error("token not found");
        }
        res.status(200).send(myToken.email)

    }
    catch (e) {
        res.status(400).send(e.message)
    }

}
)

module.exports = router;