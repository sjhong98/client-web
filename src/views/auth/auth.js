import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/actions.js';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import './auth.css';
import { setEmail } from '../../redux/actions.js';


export default function Auth() {
    const navigate = useNavigate();
    const key = process.env.REACT_APP_KAKAO_LOGIN;
    const serverIP = process.env.REACT_APP_SERVER_IP_ADDRESS;   
    const uri = `https://dmrs-b910d.web.app/login/auth`;
    
    console.log("uri", uri);
    const code = new URL(document.location.toString()).searchParams.get("code");
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("code: ", code);

        const fetchData = async() => {
            const tokenRes = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${key}&redirect_ur=${uri}&code=${code}`);

            const tokenObject = {
                    "access_token" : tokenRes.data.access_token, 
                    "refresh_token" : tokenRes.data.refresh_token};
            
            console.log(tokenObject);

            await axios
                .post(`http://${serverIP}:5001/user/login`,   // token 주고 jwt 받는 부분
                        {token: tokenObject})
                .then(res => {
                    if(!res.data.dbData){ // 신규가입일때
                        console.log("신규가입: ", res.data.userInfo);
                        dispatch(setEmail(res.data.userInfo.email));
                        sessionStorage.setItem("isDoctor", res.data.userInfo.isDoctor); // 확인필요
                        sessionStorage.setItem("login", true);
                        sessionStorage.setItem("name", res.data.userInfo.profile.nickname);
                        sessionStorage.setItem("birthday", res.data.userInfo.birthday);
                        navigate('/signup');
                        
                    } else {              // 기존회원일때
                        console.log("기존회원: ", res.data.dbData);
                        dispatch(setEmail(res.data.dbData.email));
                        sessionStorage.setItem("login", true);
                        // sessionStorage.setItem("isDoctor", res.data.dbData.isDoctor);
                        sessionStorage.setItem("login", true);
                        sessionStorage.setItem("name", res.data.dbData.name);
                        sessionStorage.setItem("birthday", res.data.dbData.birthday);
                        localStorage.setItem("did", res.data.dbData.did);
                        navigate('/');
                    }
                })
                .catch(err => console.log("ERROR: ", err))
        }

        fetchData();

    }, []);

    return (
            <div className='column-center auth-loading'>
                    <p>Loading</p>
                <Box sx={{ width: '60%' }}> 
                    <LinearProgress />
                </Box>
            </div>
    )
}
