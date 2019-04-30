const express = require('express');
const exphbs = require('express-handlebars');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//LOAD IDEA MODEL
require('./models/Idea');      
const Idea = mongoose.model('ideas');      

//----------------MIDDLEWARE----------------//


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

//METHOD OVERRIDE MIDDLEWARE :
app.use(methodOverride('_method'));

//EXPRESS SESSION MIDDLEWARE : 
app.use(session({
    secret: 'palaash',
    resave: true,
    saveUninitialized: true
  }));

app.use(flash());

//------------GLOBAL VARIABLES--------------//
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
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

//IDEA INDEX PAGE : 
app.get('/ideas',(req,res)=>{
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas=>{
        res.render('ideas/index',{
            ideas : ideas
        });
    })
   
});


//ADD IDEA FORM
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add');
});

//EDIT IDEA FORM
app.get('/ideas/edit/:id',(req,res)=>{
    Idea.findOne({
        _id : req.params.id
    }).then(idea => {
        res.render('ideas/edit',{
            idea:idea
        });
    });
});

//PROCESS FORM : 
app.post('/ideas',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text : 'Please add a title.'});
    }
    if(!req.body.details){
        errors.push({text : 'Please add some details.'});
    }

    if(errors.length > 0){
        res.render('/add',{
            errors : errors,
            title:req.body.title,
            details:req.body.details
        });
    } else{
        const newUser = {
            title : req.body.title,
            details : req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg','Video Idea Added');
            res.redirect('/ideas');
        })
    }
});

// EDIT FORM PROCESS : 
app.put('/ideas/:id', (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea=>{
            req.flash('success_msg','Video Idea Updated');
            res.redirect('/ideas');
        })
    });
});

//DELETE IDEA : 
app.delete('/ideas/:id', (req,res)=>{
    Idea.remove({
        _id: req.params.id
    }).then(()=>{
        req.flash('error_msg','Video Idea Removed');
        res.redirect('/ideas');
    });
});      


//USER LOGIN ROUTE : 
app.get('/users/login',(req,res)=>{

});

//USER REGISTER ROUTE : 
app.get('/users/register',(req,res)=>{
    
});


//USE ROUTES : 
// app.use('/ideas', ideas);

//--------------LISTENING ON PORT---------//
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});