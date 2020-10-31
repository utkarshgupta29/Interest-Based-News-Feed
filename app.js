var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
const Article = require("./schema/article");
const httpMsgs = require('http-msgs');
const request=require('request');
var rp      = require('request-promise'); 

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

app.get('/',function(req,res){
    res.render("index");
});
app.get('/home',isLoggedIn,function(req,res){
    // sports
    // politics
    // national 
    // world
    // technology
    var cats = ['sports','politics','national','world','technology'];
    User.findById(req.user._id,function(err,currUser){
        if(err){
            console.log(err);
            res.redirect('/category/sports');
        }else{
            var preferences = currUser.preferences;
            console.log("entered");
            async function p(){
                return new Promise(async function(resolve,reject){
                    var articles = {};
                    console.log("Inside promise");
                    for(var i=0;i<cats.length;i++){
                       var websites =  preferences[cats[i]];
                        if(!websites)
                            continue;
                        var arr = [];
                        for(var k=0;k<websites.length;k++){
                            await Article.find({$and :[{$or : [{category : cats[i]},{subcategory : cats[i]}]},{websiteName : websites[k]}]}).sort({date: -1}).exec().then(function(farticles){
                                for(var j=0;j<farticles.length;j++){
                                    arr.push(farticles[j]);
                                }
                            });
                        }
                       articles[cats[i]] = arr;
                    }
                    resolve(articles);

                });                
            }
            (async function (){
                await p().then((articles)=>{
                    res.render('home',{articles : articles});
                });
            })();
            
        }
    })


});

app.get('/searchresult',function(req,res){
    var arr = req.query.keyword.split(" ");
    console.log(req.query.keyword +" "+ arr);
    var keyS = req.query.keyword;
    if(arr.length>1){
       keyS = '\"'+keyS+'\"';
    }
    Article.find({$text:{$search : keyS}},async function(err,articles){
        if(err){
            console.log(req.query.keyword);
            console.log(err);
            res.redirect('/');
        }else{
           if(articles.length>0){console.log(articles); res.render('searchresult',{keyword:req.query.keyword,articles:articles}); }
           else {
               await rp('http://127.0.0.1:3000/search?q='+req.query.keyword)
                    .then((data)=>{ //console.log(JSON.parse(data));
                     res.render('searchresult',{keyword:req.query.keyword,articles:JSON.parse(data)}); });
           }
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

app.get('/profile',function(req,res){
  res.render('profile');
});

app.get('/preferences',function(req,res){
    res.render('preferences');
});
app.post('/preferences',function(req,res){
    var technology = req.body.technology;
    var sports = req.body.sports;
    var politics = req.body.politics;
    var national = req.body.national;
    var world = req.body.world;
    var user = req.user._id;
    
    var user_new_preferences = {
        technology : technology,
        sports : sports,
        politics : politics,
        national : national,
        world : world,
        scinece : [],
        business : [],
        entertainment :[]

    };
    User.findById(user._id,function(err,currUser){
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            // sports : [],
            // politics :[],
            // national : [],
            // world : [],
            // science : [],
            // business :[],
            // technology : [],
            // entertainment : []
            
	    currUser.preferences = user_new_preferences;
            currUser.save();
            User.findById(currUser._id,function(err,user){
                console.log(user);
                res.redirect('/home');    
            })
        }
    });
    // res.redirect('/');
    // User.findById()
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
				res.redirect("/preferences");
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
	successRedirect:"/home",
	failureRedirect:"/login?incorrect=1"
}),function(req,res){

});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});
app.get("*",function(err,res){
	res.render("landingpage");
});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()) return next();
		
	//console.log("incorrect password");
	res.redirect("/login");
}
app.listen(process.env.PORT || 5000,process.env.IP,function(){
console.log("server started");
});