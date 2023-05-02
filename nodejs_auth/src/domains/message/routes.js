const express = require("express");
const router = express.Router();
const { sendMessageByRoom, readMessageByRoom, test, recvPublic } = require("./controller");

router.post("/sendmessageByRoom", async (req, res) => {
    const test = await sendMessageByRoom(req)
    res.status(200).json(test)
});
router.post("/readmessageByRoom", async (req, res) => {
    const test = await readMessageByRoom(req)
    res.status(200).send(test)
});


router.get("/test", async (req, res) => {
    const testaaa = await test()
    res.status(200).json(testaaa)
});

router.post("/recvpublic", async (req, res) => {
    const testaaa = await recvPublic(req)
    res.status(200).json(testaaa)
});




module.exports = router;