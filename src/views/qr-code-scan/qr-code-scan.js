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
    const testJwt = {email:"test", name:"홍승재", jwt:"eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Imlzc3VlciI6eyJuYW1lIjoiTWVkaWNhbCBSZWNvcmQgTWFuYWdlbWVudCBBc3NvY2lhdGlvbiIsImFkZHJlc3MiOiIweDNGZTdEQjQ3MDcyMDBlY0RlN2Q0Nzg4YjgwNWYyMjU2RTNiQzQ4NjcifSwiaG9zcGl0YWwiOiLshJzsmrjrs5Hsm5AiLCJtZWRpY2FsUmVjb3JkcyI6W119fSwic3ViIjoie1wiZGlkXCI6XCJkaWQ6ZXRocjpnb2VybGk6MHgyQ0IxNzVBOTcyMDMwNjQzQjhkMmYxNjlFMzUxZTM5MzcwMmE4ODZhXCIsXCJhZGRyZXNzXCI6XCIweDJDQjE3NUE5NzIwMzA2NDNCOGQyZjE2OUUzNTFlMzkzNzAyYTg4NmFcIn0iLCJpc3MiOiJkaWQ6ZXRocjpnb2VybGk6MHg1ZEQ3MDU2MUQ0MjRFNDQxYzYwODIyMDJENkU2NDE2RjdmZkMwMTA5In0._4F0xGeyckEI_sG1uDhL3n2kekpxnQgCTN7lf2jAtQQsYZGbc5rVjtySV4IUubVvv7Qbr9GgL5Lt4Njk3cS75wA"}
    const [patientJwt, _setPatientJwt] = useState("");
    const [link, setLink] = useState("");
    const did = localStorage.getItem("dmrs-did");

    const handleTest = () => {
        const data = testJwt;

        dispatch(setPatientJwt(data.jwt));
        dispatch(setPatientName(data.name));

        console.log("jwt: ", data.jwt);

        axios.post('https://api.dmrs.space:5001/user/record/vp', 
        {
            vcJwt: data.jwt,
            did: did
        })
        .then(res => {
            console.log(res);
            dispatch(setJwtObj(res.data.medicalRecords));
        })

        axios.get('https://api.dmrs.space:5003/temp/yx82580ysw')        // 안됨
        .then(res => {
            // console.log("get qr data from server : ", res);
            // 협회DB에 자신의 진료환자 목록에 환자 did 추가해야함
        })
        .catch(err => {
            console.log(err);
        })
        
        navigate('/patient-medical-records');

        
    }

    const handleJwtInput = () => {  
        axios.post('https://api.dmrs.space:5003/link/generate', {
            payload: patientJwt
        })
        .then(res => {
            setLink(res.data.link);
            console.log("DID : ", JSON.parse(did));
            axios.post('https://api.dmrs.space:5001/user/record/vp', 
            {
                vcJwt: patientJwt,
                did: JSON.parse(did)
            })
            .then(res => {
                console.log(res);    
                dispatch(setJwtObj(res.data.medicalRecords));
                dispatch(setPatientJwt(patientJwt));
                dispatch(setPatientName("TEST"));
                navigate('/patient-medical-records');
            })
        })
        .catch(err => {
            setLink("/link/generate ERROR");
        })

    }

    return(
        <div className='root'>
            <Header />
            <div className='body'>
                <h1>QR 스캔</h1>
                <p>모바일로 환자의 QR코드를 스캔해주세요.</p>
                <button onClick={handleTest}>환자JWT 검증</button>
                <hr />
                <p>테스트용 JWT 입력 (해당 jwt의 환자 진료기록으로 이동)</p>
                <input type="text" value={patientJwt} onChange={(e) => _setPatientJwt(e.target.value)} />
                <button onClick={handleJwtInput}>jwt 입력</button>
                <p>받아온 링크 : {link}</p>
                {link==="" ? <></> : <p>이동 중</p>}
            </div>
            <Footer />
        </div>
    )
}
