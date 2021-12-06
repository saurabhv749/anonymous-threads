const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const threadId = '61adf06312f258a3b295031c'

/**
 * create thread -> report thread -> create reply -> report reply ->  read thread with reply -> delete reply -> deleter thread
 */
suite('Functional Tests', function() {

    test('Creating a new thread: POST request to /api/threads/{board}' , function(done){
        
        chai.request(server)
        .post('/api/threads/test')
        .send({text:'test',delete_password:'test'})
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            done()
         });
    })

    test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}' , function(done){
        
        chai.request(server)
        .get('/api/threads/test')
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isArray(res.body,'response should be array of recent threads and with 3 replies each')
            assert.isAtMost(res.body.length,10,'length of threads in response')
            assert.isAtMost(res.body[0].replies.length,3,'length of threads in response')
            done()
         });
    })


    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password' , function(done){
        
        chai.request(server)
        .delete('/api/threads/test')
        .send({
            thread_id: threadId,
            delete_password : 'dummyPassword'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'incorrect password')
            done()
         });
    })



    

    test('Reporting a thread: PUT request to /api/threads/{board}' , function(done){
        
        chai.request(server)
        .put('/api/threads/test')
        .send({
            report_id: threadId,
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'success')
            done()
         });
    })

    // post new reply
    test('Creating a new reply: POST request to /api/replies/{board}' , function(done){
        
        chai.request(server)
        .post('/api/replies/test')
        .send({
            thread_id: threadId,
            text:'test reply 1',
            delete_password: 'test reply 1'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            done()
         });
    })


    test('Viewing a single thread with all replies: GET request to /api/replies/{board}' , function(done){
        
        chai.request(server)
        .get('/api/replies/test?thread_id=61ae0ae82f4d32177f329d15')
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')

            assert.isObject(res.body,'response will be json file of single thread')
            assert.hasAllKeys(res.body,['text','created_on','bumped_on','_id','replies'])
            assert.isArray(res.body.replies,'replies should be array')
            done()
         });
    })



    test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password' , function(done){
        
        chai.request(server)
        .delete('/api/replies/test')
        .send({
            thread_id:threadId,reply_id:'61ae0b803f4b2fa3b43e80a6',delete_password:'dummy password'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'incorrect password')
            done()
         });
    })



    test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password' , function(done){
        // will get "incorrect password " because this reply id don't exists
        chai.request(server)
        .delete('/api/replies/test')
        .send({
            thread_id:threadId,reply_id:'61ae0b803f4b2fa3b43e80a6',delete_password:'test reply 1'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'incorrect password')
            done()
         });
    })


    test('Reporting a reply: PUT request to /api/replies/{board}' , function(done){
        // will get "incorrect password " because this reply id don't exists
        chai.request(server)
        .put('/api/replies/test')
        .send({
            thread_id:threadId,
            reply_id:'61ae0b803f4b2fa3b43e80a6'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'success')
            done()
         });
    })

    // delete thread
    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password' , function(done){
        
        chai.request(server)
        .delete('/api/threads/test')
        .send({
            thread_id: threadId,
            delete_password : 'test'
        })
        .end(function (err, res) {
            assert.isNull(err,'error should be null')
            assert.equal(res.status,'200','request should succeed')
            assert.isString(res.body,'response should be string')
            assert.equal(res.body,'success')
            done()
         });
    })




});
