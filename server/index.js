const express = require("express")
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth } = require("./middleware/auth")
const { User } = require("./models/User")

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져옴 
app.use(bodyParser.urlencoded({extended:true}));
//application json 타입으로 된것을 분석해서 가져옴 
app.use(bodyParser.json());
app.use(cookieParser());//쿠키파서 사용 

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify:false
}).then(() => console.log('MongoDB conected...'))
  .catch(err => console.log(err))

app.get('/',function(req,res){
    res.send('first app!!');
});


app.get('/api/hello',(req,res) => res.send("Hello World~!"))

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

app.post('/api/users/login',(req,res) =>{
    //요청한 이메일이 db에 있는지 찾는다. 
    User.findOne({ email:req.body.email},(err,user)=>{//User db를가져옴 findOne은 몽고db에서 제공하는 메소드 이용
        if(!user){
            return res.json({
                loginSuccess:false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 db에있다면 비밀번호가 맞는 비밀번호 인지 확인
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess:false, message:"비밀번호가 틀렸습니다."})

            //비밀번호가 맞다면 그유저를위한 token생성, 토큰생성을 위해 npm install jsonwebtoken --save
            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);
                
                //토큰을 저장한다. 어디에? 쿠키,로컬스토리지
                //npm install cookie-parser 필요 
                res.cookie("x_auth",user.token)//쿠키가생성
                .status(200)//성공
                .json({ loginSuccess:true, userId: user._id})//json으로 데이터보내주면됨
            })
        })//comparePassword메소드를 만들어서 req.body,password랑 (err,Ismatch)를 넣어줌
    })
})

//role 1 어드민 role 2 특정 부서 어드민
//role 0 -> 일반유저 role 0이 아니면 관리자 
app.get('/api/users/auth', auth ,(req,res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.uwer.role === 0 ? false : true,//auth.js에서 user를 req.user로 담아서
        email: req.user.lastname,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
})

app.get('/api/users/logout',auth,(res,req) => {
    User.findOneAndUpdate({_id:req.user._id}),//user모델을 가져와서 업데이트 
        { toke: ""}//지워줌
    , (err, user) => {
        if(err) return res.json({ succcess: false, err});
        return res.status(200).send({
            succcess: true
        })
    }
})

app.listen(port,function(){
    console.log('express listening on port',port);
});