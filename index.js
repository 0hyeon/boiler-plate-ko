const express = require("express")
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User")

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져옴 
app.use(bodyParser.urlencoded({extended:true}));
//application json 타입으로 된것을 분석해서 가져옴 
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify:false
}).then(() => console.log('MongoDB conected...'))
  .catch(err => console.log(err))

app.get('/',function(req,res){
    res.send('first app!!');
});
app.post('/register',(req,res) => {
    //client에서 로그인 정보를 가져옴 
    const user = new User(req.body)

    user.save((err,doc) => {
        if(err) return res.json({ succcess: false, err})
        return res.status(200).json({//성공하면 succcess: true로 전달 
            succcess: true
        })
    })//save는 mongodb에서 오는 메서드 
})
app.listen(port,function(){
    console.log('express listening on port',port);
});