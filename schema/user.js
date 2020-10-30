var mongoose = require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
const user = "admin";	//replace with your username   testUser
const pass = "admin";	//replace with your password   caJVL81AbLu7pe4D


// For local MongoDB
// const db_url = 'mongodb://localhost/InterestBasedNewsFeed';	

//For Cloud MongoDB
const db_url = 'mongodb+srv://'+user+':'+pass+'@cluster0.stbzy.mongodb.net/InterestBasedNewsFeed?retryWrites=true&w=majority';

mongoose.connect(db_url,{useNewUrlParser: true , useUnifiedTopology: true});


var userSchema =new mongoose.Schema({
	username:String,
	email: String,
	phoneno: String,
	password: String,
	preferences : {
		sports : [],
		politics :[],
		national : [],
		world : [],
		science : [],
		business :[],
		technology : [],
		entertainment : []
	}
});
userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User',userSchema);
module.exports = User;