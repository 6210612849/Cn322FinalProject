const Message = require("./message-model");
const {
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const crypto = require("crypto");

const ChatRoomModel = require("../chat_room/chat-model");
const KeyPair = require("./key-model")
const { getAllUser } = require("../chat_room/controller")

const test = async (req) => {

  const temp = await getAllUser();
  temp.forEach(async (index) => {

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
      email: index.email, public: mykey.publicKey, private: mykey.privateKey

    })
    await Input.save()


    console.log(index)
  })
}

const sendMessageByRoom = async (req) => {
  try {
    const { roomID, payload, writedBy } = req.query
    if (!(roomID && payload && writedBy)) {
      throw Error("bad request")
    }
    const ChatRoom = await ChatRoomModel.findOne({ chatInviteID: roomID })
    if (!ChatRoom) {
      throw Error("room not found")
    }
    if (!(ChatRoom.email).includes(writedBy)) {
      throw Error("no permission")
    }

    var myMessage = { messageID: null }
    while (true) {
      const uuid = uuidv1();
      const SameMessageID = await Message.findOne({ messageID: uuid });
      if (!SameMessageID) {
        myMessage.messageID = uuid

        break;
      }
    }
    const res = await createMessage(myMessage.messageID, ChatRoom, payload, writedBy)
    return res


  }
  catch (e) {
    throw Error(e)
  }
}

const createMessage = async (
  messageID, ChatRoom, payload, writedBy
) => {
  try {

    const { myEncrypted, myIV } = await enMessage(ChatRoom, payload, writedBy)

    const myInput = new Message({
      messageID, roomID: ChatRoom.chatRoomID, payload: myEncrypted, writedBy, iv: myIV, created: Date.now(), updated: Date.now()
    })
    const resCreated = await myInput.save()

    return resCreated
  } catch (error) {
    console.log(error)
    throw error;
  }
};


const enMessage = async (myRoom, mes, myEmail) => {
  const iv = crypto.randomBytes(16);
  const myIndex = myRoom.email.indexOf(myEmail)
  var mySym = null
  const myPrivate = await recvMyPrivate(myEmail)
  if (myIndex == 0) {
    const myEncryptedKey = Buffer.from(myRoom.key1, 'base64')
    mySym = crypto.privateDecrypt(myPrivate, myEncryptedKey)
  }
  else {
    const myEncryptedKey = Buffer.from(myRoom.key2, 'base64')
    mySym = crypto.privateDecrypt(myPrivate, myEncryptedKey)
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', mySym, iv);
  var encryptedMessage = cipher.update(mes, 'utf8', 'hex');
  console.log(encryptedMessage)
  encryptedMessage += cipher.final('hex');

  // const myPrivate = await recvMyPrivate(myEmail)
  // const toPublic = await recvPublic(myRoom, myEmail)
  // // const encrypted = crypto.publicEncrypt({ key: toPublic, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(mes, 'utf8'));
  // // const encrypted = crypto.publicEncrypt(toPublic, Buffer.from(mes, 'utf8'));
  // const encrypted = crypto.publicEncrypt(toPublic, Buffer.from(mes));
  // const signature = crypto.sign('sha256', Buffer.from(mes), myPrivate);
  return { myEncrypted: encryptedMessage, myIV: iv.toString('hex') }
}


const recvMyPrivate = async (myData) => {
  try {


    const resPub = await KeyPair.findOne({ email: myData })
    return resPub.private

  }
  catch (e) {
    throw Error(e)
  }
}


const recvPublic = async (myData, myEmail) => {
  try {
    const myRoom = myData
    const tempEmail = myRoom.email
    const remainEmail = tempEmail.filter(emails =>

      emails !== myEmail);

    const resPub = await KeyPair.findOne({ email: remainEmail })
    return resPub.public

  }
  catch (e) {
    throw Error(e)
  }
}


const recvPublicUsedByChat = async (myData, myEmail) => {
  try {

    const tempEmail = myData
    const remainEmail = tempEmail.filter(emails =>

      emails !== myEmail);

    const resPub = await KeyPair.findOne({ email: remainEmail })
    return resPub.public

  }
  catch (e) {
    throw Error(e)
  }
}

const readMessageByRoom = async (req) => {
  try {
    const { roomID, myEmail } = req.query
    console.log("ayoyoyoyyoy", roomID, myEmail)
    if (!(roomID && myEmail)) {
      throw Error("bad request")
    }
    const ChatRoom = await ChatRoomModel.findOne({ chatInviteID: roomID })
    if (!ChatRoom) {
      throw Error("room not found")
    }
    if (!(ChatRoom.email).includes(myEmail)) {
      throw Error("no permission")

    }
    console.log("tesssst")
    const allMessage = await Message.find({ roomID: ChatRoom.chatRoomID }).sort({ created: 1 }).exec()
    console.log(allMessage)

    const tempData = []
    for (let myMes of allMessage) {
      const resDe = await deMessage(myMes, myEmail, ChatRoom)
      tempData.push(resDe)
    }



    return tempData

  }
  catch (e) {
    throw Error(e)
  }



}


const deMessage = async (myMes, myEmail, tempData) => {
  try {
    const myPayload = myMes.payload
    const myIV = Buffer.from(myMes.iv, 'hex')
    const myIndex = tempData.email.indexOf(myEmail)


    if (myIndex == 0) {

      const myPrivate = await recvMyPrivate(myEmail)
      const mySymRaw = Buffer.from(tempData.key1, 'base64')
      const mySym = crypto.privateDecrypt(myPrivate, mySymRaw);

      const decipher = crypto.createDecipheriv('aes-256-cbc', mySym, Buffer.from(myIV, 'hex'));
      let decryptedMessage = decipher.update(myPayload, 'hex', 'utf8');
      decryptedMessage += decipher.final('utf8');

      // const decrypted = crypto.privateDecrypt(
      //   myPrivate, Buffer.from(myMes.payload, 'base64'));
      const returnMessage = { messageID: myMes.messageID, created: myMes.created, updated: myMes.updated, payload: decryptedMessage, writedBy: myMes.writedBy }


      // let decryptedMessage = decipher.update(messageData.message, 'hex', 'utf8');
      // decryptedMessage += decipher.final('utf8');
      return returnMessage
      // const verified = crypto.verify('sha256', decrypted, toPublic, Buffer.from(myMes.signature, 'base64'));
      // console.log("message:", decrypted.toString(), "is form :", verified)
    }
    else {
      const myPrivate = await recvMyPrivate(myEmail)
      const mySymRaw = Buffer.from(tempData.key2, 'base64')
      const mySym = crypto.privateDecrypt(myPrivate, mySymRaw);

      const decipher = crypto.createDecipheriv('aes-256-cbc', mySym, Buffer.from(myIV, 'hex'));
      let decryptedMessage = decipher.update(myPayload, 'hex', 'utf8');
      decryptedMessage += decipher.final('utf8');
      const returnMessage = { messageID: myMes.messageID, created: myMes.created, updated: myMes.updated, payload: decryptedMessage, writedBy: myMes.writedBy }

      return returnMessage

    }
    // console.log(decrypted, verified)
    // const decrypted = crypto.privateDecrypt(myPrivate, myMes.payload);
    // const test = Buffer.from(myMes.signature, 'base64')

  }
  catch (e) {
    throw Error(e)
  }
}
const checkEmailIndex = () => {

}
// const recvPublic = async (req) => {
//   try {
//     const { email, roomInviteID } = req
//     if (!email && !roomInviteID) {
//       throw Error("bad request")
//     }
//     const checkIsValid = await ChatRoomModel.findOne({ chatInviteID: roomInviteID, email: { $in: email } })
//     if (!checkIsValid) {
//       throw Error("no permission")
//     }
//     const tempEmail = checkIsValid.email
//     const remainEmail = tempEmail.filter(emails =>

//       emails !== email);

//     const resPub = await KeyPair.findOne({ email: remainEmail })
//     return resPub.public

//   }
//   catch (e) {
//     throw Error(e)
//   }
// }

// function decodePem(pemString) {
//   const lines = split(pemString, "\n");
//   const start = -1;
//   const end = -1;
//   foreach (index, line in lines) {
//       if (line == "-----BEGIN PUBLIC KEY-----" || line == "-----BEGIN RSA PRIVATE KEY-----") start = index + 1; 
//       if (line == "-----END PUBLIC KEY-----" || line == "-----END RSA PRIVATE KEY-----") end = index;
//   }

//   if (start !== -1 && end > start) {
//     const all = lines.slice(start, end).reduce((a, b) => a + b);
//     return http.base64decode(all);
//   }


// return null;
// }

module.exports = { sendMessageByRoom, test, readMessageByRoom, recvPublicUsedByChat };
