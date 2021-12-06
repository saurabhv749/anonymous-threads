'use strict';

const threads = require('../controllers/thread')
const replies = require('../controllers/replies')

module.exports = function (app) {
  
  // for threads
  app.route('/api/threads/:board')
  .post(threads.POST)
  .put(threads.PUT)
  .get(threads.GET)
  .delete(threads.DELETE)


  // handling replies
  app.route('/api/replies/:board')
  .post(replies.POST)
  .put(replies.PUT)
  .get(replies.GET)
  .delete(replies.DELETE)

};
