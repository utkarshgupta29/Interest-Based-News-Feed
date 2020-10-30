var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
const Article = require("./schema/article");
const httpMsgs = require('http-msgs');


app.use(require("express-session")({
	secret:"india is the best country",
	resave:false,
	saveUninitialized:false
}));

app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+'/public'));

//mongoose.connect("mongodb://localhost/insurance", {useNewUrlParser: true , useUnifiedTopology: true});




var User =require("./schema/user.js");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});



app.get('/searchresult',function(req,res){
    Article.find({$text:{$search : req.query.keyword}},function(err,articles){
        if(err){
            console.log(req.query.keyword);
            console.log(err);
            res.redirect('/');
        }else{
            res.render('searchresult',{keyword:req.query.keyword,articles:articles});
        }
    });
});
app.get('/articles/:id',function(req,res){
    Article.findById(req.params.id,function(err,foundArticle){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render('show',{article:foundArticle});
        }
    });
});

app.get('/category/:category',function(req,res){
    res.render('category',{category : req.params.category});
});

app.post('/category/:category',function(req,res){
    var selectedSites = req.body['websites[]'];
    // console.log();
    Article.find({$and : [{$or : [{category : req.params.category},{subcategory: req.params.category}]}, {websiteName : {$in : selectedSites}}]},function(err,articles){
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            httpMsgs.sendJSON(req,res,{
                from : articles
            });
        }
    });
    
});



//                NONE OF YOUR BUSINESS

//==========================================================================================


app.post("/signup",function(req,res){

	User.register(new User({username:req.body.email}),req.body.password,function(err,usercurrent){
		if(err){
			console.log(err);
			return res.render('signup');
		}
		passport.authenticate("local")(req,res,function(){
			User.findOneAndUpdate({username:req.body.email},{$set:{email:req.body.email,userid:req.body.phoneno,ac_address:req.body.ac_address,name:req.body.name,phoneno:req.body.phoneno}},function(err,data){
				if(err) console.log(err);
				res.redirect("/preference");
			});
			
		});
	});
	
});


app.get("/signup",function(req,res){
	res.render("signup");
});
app.get("/login",function(req,res){
	if(req.isAuthenticated()) res.redirect("/");
	else if(req.query.incorrect) 
		res.render("login",{retry:true});
	else
	res.render("login",{retry:false});
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login?incorrect=1"
}),function(req,res){

});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});
app.get("/*",function(err,res){
	res.render("home");
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()) return next();
		
	//console.log("incorrect password");
	res.redirect("/login");
}
app.listen(3000,process.env.IP,function(){
console.log("server started");
});


