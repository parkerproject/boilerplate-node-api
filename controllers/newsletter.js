/**
* Created with dealsbox api.
* User: parkerproject
* Date: 2015-01-13
* Time: 08:04 PM
* To change this template use Tools | Templates.
*/

// require('mongodb').connect(uri, function (err, db) {
//   if (err) return handleError(err);

//   // get a collection
//   var collection = db.collection('artists');

//   // pass it to the constructor
//   mquery(collection).find({..}, callback);

//   // or pass it to the collection method
//   mquery().find({..}).collection(collection).exec(callback)

//   // or better yet, create a custom query constructor that has it always set
//   var Artist = mquery(collection).toConstructor();
//   Artist().find(..).where(..).exec(callback)
// })