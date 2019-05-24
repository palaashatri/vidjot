if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI : 'mongodb+srv://palaashatri:admin@cluster0-udcsw.mongodb.net/test?retryWrites=true'}
} else{
    module.exports = {mongoURI : 'mongodb://localhost/vidjot-dev'}
}