const ChatRoom = require("./chat-model");

const {
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const crypto = require("crypto");
const User = require("../user/model");
const { recvPublicUsedByChat } = require("../message/controller");

const getchat = async (data) => {
  try {
    const what = await ChatRoom.find().exec()
    console.log(what)
    return what
  }
  catch (e) {
    throw e
  }
}

const createNewChatRoom = async (req) => {
  try {

    const { email1, email2 } = req.query;
    // const { email1, email2 } = req.body;

    if (!email1 && !email2) {
      console.log(req)
      throw Error('bad request')
    }


    const resAlreadyHave = await findUserSame(email1, email2)
    if (resAlreadyHave) {
      return resAlreadyHave.chatInviteID
    }
    var myRoom = { myRoomID: null, myRoomInvite: null }
    while (true) {
      const id = crypto.randomBytes(2).toString("hex");
      const uuid = uuidv1();
      const SameChatRoomID = await ChatRoom.findOne({ chatRoomID: uuid });
      const SameChatInviteID = await ChatRoom.findOne({ chatInviteID: id });
      if (!SameChatRoomID && !SameChatInviteID) {
        myRoom.myRoomID = uuid
        myRoom.myRoomInvite = id
        break;
      }

    }
    console.log(myRoom.myRoomInvite)
    const res = await createRoom(myRoom.myRoomID, myRoom.myRoomInvite, email1, email2)
    return myRoom.myRoomInvite

  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const res = await User.find()
    return res
  }
  catch (e) {
    console.log(e)
    throw Error(e)
  }
}


function findUserSame(data1, data2) {
  return new Promise((resolve, reject) => {
    ChatRoom.findOne({ email: { $all: [data1, data2] } }, (err, user) => {
      if (err) {
        reject(null)
      } else {
        resolve(user);
      }
    });
  });
}


const createRoom = async (
  ID, InviteID, email1, email2
) => {
  try {
    const tempEmail = [email1, email2]
    const mySymPub2 = await recvPublicUsedByChat(tempEmail, email1)
    const mySymPub1 = await recvPublicUsedByChat(tempEmail, email2)
    const symmetricKey = crypto.randomBytes(32)

    const encryptedSymmetricKey2 = crypto.publicEncrypt(mySymPub2, symmetricKey);
    const encryptedSymmetricKey1 = crypto.publicEncrypt(mySymPub1, symmetricKey);

    const myInput = new ChatRoom({
      chatRoomID: ID, chatInviteID: InviteID, email: [email1, email2], key1: encryptedSymmetricKey1.toString('base64'), key2: encryptedSymmetricKey2.toString('base64')
    })
    const resCreated = await myInput.save()

    return resCreated
  } catch (error) {
    console.log(error)
    throw error;
  }
};
module.exports = { createNewChatRoom, getchat, getAllUser };
