const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//암호화 시키는 패키지
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique:1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{
        type:Number
    }
})
userSchema.pre('save',function(next){//pre는 mongoose메서드 save 하기전 next로 보냄 
    //비밀번호를 암호화 시킨다.
    var user = this;
    if(user.isModified('password')){//비밀번호 수정시에만 

        bcrypt.genSalt(saltRounds,function(err, salt){
            if(err)return next(err)//error가 나면 err로 보내주고요
    
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)//error가 나면 err로 보내주고요
                
                //암호화 성공했다면
                user.password = hash//비밀번호를 hash로 바꿔줌
                next()//돌아갸야죠 Userjs에user.save끝나는 지점으로
    
            })//제대로 생성했다면 (풀네임비밀번호,암호화패키지salt)  , hash는 암호화된내용 , this = 상수u serSchema를 가르킴 
        })

    }else{
        next()//이게없으면 여기서 머무름
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword 1234567 , 암호화된 비밀번호 랑 비교를 해야
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err),//틀리면 err
        cb(null,isMatch)//에러가없고(null), isMatch(true)이면  
    })//index.js에서 comparePassword메서드를 사용가능할수있다.
}

//토큰생성
userSchema.methods.generateToken = function(cb){//cb는 콜백
    
    var user = this;
    //jsonwebtoken을 이용해서 tonken생성하기
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    // user._id + 'secretToken'= token
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}


const User = mongoose.model('User',userSchema)

//다른데서도 쓸수있게 exports
module.exports={ User }