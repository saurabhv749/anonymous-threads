const mongoose = require('mongoose')


let replySchema = new mongoose.Schema({
  text:String,
  delete_password:String,
  created_on:Date,
  reported:{
    type:Boolean,
    default:false,
  },
})

let threadSchema = new mongoose.Schema({
  text:String,
  reported:{
    type:Boolean,
    default:false,
  },
  delete_password: String,
  created_on:Date,
  bumped_on:Date,
  replies: {type: [replySchema] , default:[]},
  replycount:{type:Number , default:0}
})


let boardSchema = new mongoose.Schema({
  board:String,
  threads: [threadSchema]
})


let Board = mongoose.model('board',boardSchema)

module.exports = Board