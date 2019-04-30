const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

const app = express();

//LOAD ROUTES : 
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//----------------MIDDLEWARE----------------//

//PASSPORT CONFIG : 
require('./config/passport')(passport);

//MAP GLOBAL PROMISE - GET RID OF WARNNG : 
mongoose.Promise = global.Promise;

//CONNECT TO MONGOOSE : 
mongoose.connect('mongodb://localhost/vidjot-dev',{
    // useMongoClient : true,
    useNewUrlParser: true
})
.then(()=> console.log('mongodb connected'))
.catch(err=> console.log(err));

//-----------------------//

//HANDLEBARS MIDDLEWARE : 
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//BODY PARSER MIDDLEWARE :
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//STATIC FOLDER :
app.use(express.static(path.join(__dirname,'public')));

//METHOD OVERRIDE MIDDLEWARE :
app.use(methodOverride('_method'));

//EXPRESS SESSION MIDDLEWARE : 
app.use(session({
    secret: 'palaash',
    resave: true,
    saveUninitialized: true
  }));

 //PASSPORT MIDDLEWARE :  
app.use(passport.initialize());
app.use(passport.session());  

app.use(flash());

//------------GLOBAL VARIABLES--------------//
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//------------------ROUTES------------------//

//INDEX ROUTE : 
app.get('/',(req,res)=>{
    const title = 'Welcome!'
    res.render('index',{title:title});
}); 

//ABOUT ROUTE : 
app.get('/about',(req,res)=>{
    res.render('about');
});





//USE ROUTES : 
app.use('/ideas',ideas);
app.use('/users',users);


//--------------LISTENING ON PORT---------//
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});