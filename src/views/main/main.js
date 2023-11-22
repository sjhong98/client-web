import React, { useEffect, useState } from 'react';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import "./main.css";
import { useNavigate } from 'react-router-dom';
import kakaoLogin from '../../assets/images/kakao-login.png';

function QrCard() {
    const navigate = useNavigate();
    const banners = [{title: 'QR코드 스캔', url: './qr-code-scan'}, {title: '환자 진료기록', url: './patient-list'}, {title: '의사 인증', url: './doctor-auth'}]

    return (
        <div className='main-main'>
            { banners.map((item, index) => {
                return (
                    <div 
                        key={index} 
                        className='main-banners'
                        onClick={() => navigate(`${item.url}`)}
                    >
                        <p>{item.title}</p>
                    </div>
                )
            })

            }

        </div>
    )
}

export default function Main() {
    const navigate = useNavigate();
    const [login, setLogin] = useState(sessionStorage.getItem("dmrs-login"));

    useEffect(() => {
        sessionStorage.setItem("dmrs-isDoctor", true);
    }, [])

    const handleTest = () => {
        sessionStorage.setItem("dmrs-login", true);
        setLogin(true);
        sessionStorage.setItem("dmrs-name", "admin");
        sessionStorage.setItem("dmrs-birthday", "231115");
        localStorage.setItem("dmrs-did", JSON.stringify({"did":"did:ethr:goerli:0x19E95F46a9bB598A497383d9cc838C21A3788D7C","address":"0x19E95F46a9bB598A497383d9cc838C21A3788D7C"}));
        // localStorage.setItem("dmrs-did", "did:ethr:goerli:0x19E95F46a9bB598A497383d9cc838C21A3788D7C");
        // localStorage.setItem("dmrs-address", "0x19E95F46a9bB598A497383d9cc838C21A3788D7C");
    }
    
    return(
        <div className='root'>
            <Header />
            <div className='body column-center'>
                {
                    login ?
                    <QrCard />
                    :
                    <div className="login-box column-center">
                        <p className="no-margin" style={{fontSize:'50px'}}>소셜로그인</p>
                        <img className='kakao-login pointer' 
                            src={kakaoLogin} 
                            onClick={()=>{navigate("/login")}}
                            alt={'...'} 
                        />
                        <button onClick={handleTest}>TEST</button>
                    </div>
                }
            </div>
            <Footer />
        </div>
    )
}