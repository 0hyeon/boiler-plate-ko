const express = require("express")
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:1111@boilerplate.jywk4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify:false
}).then(() => console.log('MongoDB conected...'))
  .catch(err => console.log(err))

app.get('/',function(req,res){
    res.send('first app');
});
app.listen(port,function(){
    console.log('express listening on port',port);
});