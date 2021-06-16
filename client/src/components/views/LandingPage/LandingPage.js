import React ,{useEffect} from 'react'
import axios from 'axios';
// import { response } from 'express';
function LandingPage() {//LandingPage들어오자 마자 useEffect 실행 

    useEffect(() => {
        axios.get('/api/hello')//get req를 서버에다 보내서 
        .then(response=> {console.log(response)})//서버에서 돌아오는 res를 콘솔창에 볼수있게 해주는것 
    }, [])


    return (
        <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', width:'100%',height:'100vh'}}>
            <h2>시작페이지</h2>
        </div>
    )
}

export default LandingPage
