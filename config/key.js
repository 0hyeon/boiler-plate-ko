if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');//production(배포)일경우 환경변수
}else{
    module.exports = require('./dev');//local일경우 환경변수 
}