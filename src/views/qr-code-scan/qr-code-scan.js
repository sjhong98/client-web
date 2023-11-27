import axios from 'axios';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import { useDispatch } from 'react-redux';
import { setJwtObj, setPatientJwt, setPatientName } from '../../redux/actions.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function QrCodeScan() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [patientJwt, _setPatientJwt] = useState("");
    const [vpJwt, setVpJwt] = useState("");
    const [link, setLink] = useState("");
    const did = localStorage.getItem("dmrs-did");

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
            console.log(JSON.parse(did));
            
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
                <p>모바일로 환자의 QR코드를 스캔해주세요.</p>
                <p>테스트용 JWT 입력 (해당 jwt의 환자 진료기록으로 이동)</p>
                <input type="text" value={patientJwt} onChange={(e) => _setPatientJwt(e.target.value)} />
                <button onClick={handleJwtInput}>jwt 입력</button>
                <p>QR로부터 받아온 링크 : {link}</p>
                <p>link로부터 받아온 vpJwt : {vpJwt}</p>
                {vpJwt==="" ? <></> : <p>이동 중</p>}
            </div>
            <Footer />
        </div>
    )
}

