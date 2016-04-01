var mongoose = require('mongoose');
var User = require('../models/user.js');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/satellizer';
mongoose.connect(mongoURI);




User.collection.drop();

var user1 = new User({

 email: "admin@admin.com",
 password: "password",

 // projects: project1._id,

});
user1.save(function(){

  mongoose.connection.close();
});









