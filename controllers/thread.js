const Boards = require('../models/board.model')

module.exports = {
    POST : async(req,res)=>{
        // create new thread
        try {
          const {text,delete_password} = req.body
          const {board} = req.params
        if(board && text && delete_password){
          const date = new Date().toISOString()
    
          const newThread = {
            text,
            delete_password,
            created_on:date,
            bumped_on:date,
          }
    
          await Boards.findOneAndUpdate({ board },
            {$push:{threads: { $each:  [newThread] ,$sort:{_id:-1}   } } }
            ,{upsert:true,new:true})
    
          res.redirect(`/b/${board}/`)
        }
        } catch (error) {
           console.log(error)
        }
      },

    PUT : (req,res)=>{
        const {report_id} = req.body
        const {board} = req.params
    
        Boards.findOneAndUpdate({board,'threads.thread_id':report_id},
        {$set: {'threads.$[threadX].reported': true}},
        {arrayFilters:[ {'threadX._id':report_id} ] ,new:true})
        .then(doc=> res.json('success') )
        .catch(err=>console.log(err))    
      },
      
    GET  : async(req,res)=>{
        //10 most recent threads and 3 most recent replies
        try {
          const {board}  = req.params
          let data = await Boards.findOne({board},{'threads.reported':0,'threads.delete_password':0,'threads.replies.reported':0,'threads.replies.delete_password':0,})
                              .limit({'threads.replies':3})
    
          let slicedThreads = data.threads.slice(0,10)
    
          slicedThreads.forEach(t=>{
            t.replies = t.replies.slice(0,3)
          })
    
         res.json(slicedThreads)
        } catch (error) {
          console.log(error)
        }
      },
    
    DELETE :  (req,res)=>{
        const {thread_id,delete_password} =  req.body
        const {board} = req.params
    
        Boards.findOneAndUpdate({board,'threads.thread_id':thread_id,'threads.delete_password':delete_password},
        { $pull: {threads : {_id:thread_id} } },
        {new:true})
        .then(doc=>{
          if(doc===null)
            return res.json('incorrect password')
          else
            return res.json('success')
        })
        .catch(err=>console.log(err))
      }
}