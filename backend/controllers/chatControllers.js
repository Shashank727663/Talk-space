const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/UserModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async(req,res) => {
    try{
       Chat.find({users:{$elemMatch:{ $eq : req.user._id}}})
       .populate("users","-password")
       .populate("groupAdmin","-password")
       .populate("latestMessage")
       .sort({updatedAt : -1 })
       .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.send(results);
      });
    }
    catch(err) {
        res.sendStatus(400);
    throw new Error(err.message);
    }
})


const createGroupChat = asyncHandler(async(req,res) => {
    if( !req.body.users || !req.body.name) {
        return res.sendStatus(400).send({ message : " pleasee fill all the entries"});
    }

    var users = JSON.parse(req.body.users);

    if(users.length < 2) {
        return res.sendStatus(400).send("select more than 2 users for a group chat ")
    }
    users.push(req.user);
    //query db 
    try{
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id})
        .populate("users" ,"-password")
        .populate("groupAdmin" , "-password")

        res.json(fullGroupChat)
    }
    catch(err) {
        res.sendStatus(400)
        throw new Error(err.message)
    }
})

const renameGroup = asyncHandler(async(req,res) => {
    const {chatId ,chatName } = req.body;

    const upadatedChat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})


    // quering db 
    .populate("users" ,"-password")
    .populate("groupAdmin", "-password")


    if(!upadatedChat) {
        res.send(404);
        throw new Error("chat not found");
    }
    else{
        res.json(upadatedChat)
    }

})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  });
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });
  
module.exports = { accessChat ,fetchChats , createGroupChat , renameGroup ,removeFromGroup ,addToGroup}