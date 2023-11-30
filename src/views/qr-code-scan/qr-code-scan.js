import axios from 'axios';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import { useDispatch } from 'react-redux';
import { setJwtObj, setPatientJwt, setPatientName, setPatientInfo, setPatientVc, setIsDiagnosis } from '../../redux/actions.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function QrCodeScan() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [patientJwt, _setPatientJwt] = useState("");
    const [patientJwt2, _setPatientJwt2] = useState("");
    const [vpJwt, setVpJwt] = useState("");
    const [link, setLink] = useState("");
    const [msg, setMsg] = useState("");

    const did = JSON.parse(localStorage.getItem("dmrs-did"));
    const didAddress = did.address;

    const handleGetRecords = () => {
        console.log("didAddress : ", didAddress);
        axios.get(`https://api.dmrs.space:5003/temp/${didAddress}`)
        .then(res => {
            let temp = [];
            console.log("===== Received VP =====\n", res.data.payload);
            dispatch(setPatientInfo(res.data.payload.decodedVpContents[0].userInfo));
            for(let i=1; i<res.data.payload.decodedVpContents.length; i++) {
                temp.push(res.data.payload.decodedVpContents[i]);
            }
            dispatch(setPatientVc(temp));
            dispatch(setIsDiagnosis(true));
            navigate('/patient-medical-records');
        })
        .catch(err => {
            console.log("링크 오류", err);
        }) 
    }


    const handleMobileTest = () => {
        axios.post('https://api.dmrs.space:5003/link/generate', {
            payload: patientJwt2
        })
        .then(res => {
            setMsg("링크 생성 중...");
            console.log("qr로부터 받아온 link : ", res.data.link);
            
            axios.get(`${res.data.link}`)
            .then(res => {
                console.log("link로부터 받아온 vpJwt : ", res.data.payload)
                
                axios.post('https://api.dmrs.space:5001/user/record/vp', 
                {
                    vpJwt: res.data.payload,
                    did: did
                })
                .then(res => {
                    console.log("===== record/vp =====\n", res);    
                    setMsg("링크가 생성되었습니다. 환자기록 가져오기 버튼을 클릭해주세요");
                })
                .catch(err => {
                    console.log(err);
                })
            })
            
        })
        .catch(err => {
            setLink("/link/generate ERROR");
            console.log(err);
        })
    }

    const handleJwtInput = () => {  
        axios.post('https://api.dmrs.space:5003/link/generate', {
            payload: patientJwt
        })
        .then(res => {
            console.log("qr로부터 받아온 link : ", res.data.link);
            setLink(res.data.link);
            
            axios.get(`${res.data.link}`)
            .then(res => {
                console.log("link로부터 받아온 vpJwt : ", res.data.payload)
                setVpJwt(res.data.payload);
                
                axios.post('https://api.dmrs.space:5001/user/record/vp', 
                {
                    vpJwt: res.data.payload,
                    did: did
                })
                .then(res => {
                    console.log("===== record/vp =====\n", res);    
                    dispatch(setJwtObj(res.data.medicalRecords));
                    dispatch(setPatientJwt(patientJwt));
                    dispatch(setPatientName("TEST"));
                    navigate('/patient-medical-records');
                })
                .catch(err => {
                    setLink("/record/vp ERROR");
                    console.log(err);
                })
            })
            setLink(res.data.link);
            
        })
        .catch(err => {
            setLink("/link/generate ERROR");
            console.log(err);
        })

    }

    return(
        <div className='root'>
            <Header />
            <div className='body'>
                <h1>QR 스캔</h1>
                <button onClick={handleGetRecords}>환자 진료기록 가져오기</button>
                <p>모바일로 환자의 QR코드를 스캔해주세요.</p>
                <hr />
                <p>의사 모바일 대용 테스트 (/temp/address link 반환)</p>
                <input type="text" value={patientJwt2} onChange={(e) => _setPatientJwt2(e.target.value)} />
                <button onClick={handleMobileTest}>jwt 입력</button>
                <p>{msg}</p>
                <hr />
                <p>테스트용 JWT 입력 (해당 jwt의 환자 진료기록으로 이동)</p>
                <input type="text" value={patientJwt} onChange={(e) => _setPatientJwt(e.target.value)} />
                <button onClick={handleJwtInput}>jwt 입력</button>
                <p>QR로부터 받아온 링크 : {link}</p>
                <p>link로부터 받아온 vpJwt : {vpJwt}</p>
                {vpJwt==="" ? <></> : <p>이동 중</p>}
                <hr />
            </div>
            <Footer />
        </div>
    )
}

