const express = require("express");
const router = express.Router();
const { createNewChatRoom, getchat, getAllUser, } = require("./controller");

router.post("/createchat", async (req, res) => {
    try {
        const test = await createNewChatRoom(req)
        res.status(200).send(test)
    }
    catch (e) {
        res.status(400).send(e)
    }

});
router.get("/getchat", async (req, res) => {
    const test = await getchat(req)
    res.status(200).json(test)
});

router.get("/room", function (req, res) {
    res.render("room");
});
router.get("/inroom", function (req, res) {
    res.render("inroom");
});

router.get("/in2room", function (req, res) {
    res.render("in2room");
});

router.get("/getalluser", async (req, res) => {
    const test = await getAllUser()
    res.status(200).json(test)
});

module.exports = router;