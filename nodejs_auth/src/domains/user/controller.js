const User = require("./model");
const { hashData } = require("./../../util/hashData");
const createToken = require("./../../util/createToken");
const { verifyHashedData } = require("./../../util/hashData");
const Token = require("./token-model");
const crypto = require("crypto");
const KeyPair = require("../message/key-model");
const createNewUser = async (data) => {
  try {
    const { name, email, password, secret } = data;

    // Checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw Error("User with the provided email already exists");
    }

    // hash password
    const hashedPassword = await hashData(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      secret,
    });
    // save user
    const createdUser = await newUser.save();

    const mykey = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    const Input = new KeyPair({
      email: email, public: mykey.publicKey, private: mykey.privateKey

    })
    await Input.save()


    return createdUser;
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;

    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      throw Error("Invalid credentials entered!");
    }

    if (!fetchedUser.verified) {
      throw Error("Email hasn't been verified yet. Check your inbox.");
    }

    const hashedPassword = fetchedUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw Error("Invalid password entered!");
    }

    // create user token
    const tokenData = { userId: fetchedUser._id, email };
    const token = await createToken(tokenData);

    const newToken = new Token({
      token: token,
      email: email

    })
    await newToken.save()
    //assign user token
    fetchedUser.token = token;
    return fetchedUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, authenticateUser };
