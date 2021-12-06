const Boards = require('../models/board.model')

module.exports = {
    GET : async(req,res)=>{
        const {thread_id} = req.query
        const {board} = req.params

        try {
         let boardResult = await Boards.findOne({board,'threads._id':thread_id},{'threads.$':1})
          
        if(boardResult){
          const {text,created_on,bumped_on,_id} = boardResult.threads[0]

          let replies = boardResult.threads[0].replies.map(x=>{
            return {text:x.text, created_on:x.created_on,_id:x._id}
          })
       
         let data =  {text,created_on,bumped_on,_id,replies}
     
         res.json(data)
        }

        } catch (error) {
          console.log(error)
        }
      },

    POST: async(req,res)=>{
        const {thread_id,text,delete_password} = req.body
        const {board} = req.params
    
        try {
          let date = new Date().toISOString()
          let newReply = {text,created_on:date,delete_password}
         
          await Boards.findOneAndUpdate({board,'threads._id':thread_id},
          { $push: { 'threads.$.replies':{  $each: [newReply] }      } ,
            $inc: {'threads.$.replycount':1},
            $set : {'threads.$.bumped_on':date}
            },
        {new:true} )
    
          // redirect to the thread page
          res.redirect(`/b/${board}/${thread_id}`)
        } catch (error) {
          console.log(error)
        }
      },

    PUT: (req,res)=>{
        const {thread_id,reply_id} = req.body
        const {board}  = req.params
    
        Boards.findOneAndUpdate({board,'threads.thread_id':thread_id,'threads.replies._id':reply_id},
          {$set: {'threads.$[threadX].replies.$[elem].reported': true}},
          {arrayFilters:[ { 'elem._id': reply_id}, {'threadX._id':thread_id} ] ,new:true},
        )
        .then(doc=>res.json('success'))
        .catch(err=>console.log(err))
    
      },
    DELETE: (req,res)=>{

        const {board} = req.params
        const {thread_id,reply_id,delete_password} = req.body
    
        Boards.findOneAndUpdate({board,'threads.thread_id':thread_id,'threads.replies._id':reply_id,'threads.replies.delete_password':delete_password},
          {$set: {'threads.$[threadX].replies.$[elem].text': "[deleted]"}},
          {arrayFilters:[ { 'elem._id': reply_id}, {'threadX._id':thread_id} ] ,new:true},
        )
        .then(doc=>{
    
          if(doc===null)
            return res.json('incorrect password')
          else
            return res.json('success')
    
        })
        .catch(err=>console.log(err))
      }
}