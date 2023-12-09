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
    const [getJwtDone, setGetJwtDone] = useState(false);

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
        dispatch(setPatientJwt(patientJwt2));

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
        let temp ="eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5rc3RVaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNKZExDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJbDBzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbHpjM1ZsY2lJNmV5SnVZVzFsSWpvaVRXVmthV05oYkNCU1pXTnZjbVFnVFdGdVlXZGxiV1Z1ZENCQmMzTnZZMmxoZEdsdmJpSXNJbUZrWkhKbGMzTWlPaUl3ZUROR1pUZEVRalEzTURjeU1EQmxZMFJsTjJRME56ZzRZamd3TldZeU1qVTJSVE5pUXpRNE5qY2lmU3dpZFhObGNrbHVabThpT25zaWJtRnRaU0k2SXUyWm1PeWVrQ0lzSW1WdFlXbHNJam9pYzJWdkxXMXBibk5sYjJ0QVpHRjFiUzV1WlhRaUxDSmlhWEowYUdSaGVTSTZJakF3TURFd01TSXNJbkJvYjI1bFRuVnRZbVZ5SWpvaU1ERXdMVE00TWprdE1UQXlNaUlzSW1selJHOWpkRzl5SWpwMGNuVmxMQ0poWkdSeVpYTnpJam9pTUhneVEwSXhOelZCT1RjeU1ETXdOalF6UWpoa01tWXhOamxGTXpVeFpUTTVNemN3TW1FNE9EWmhJbjBzSW0xbFpHbGpZV3hTWldOdmNtUnpJam9pTkdZMU0yTmtZVEU0WXpKaVlXRXdZekF6TlRSaVlqVm1PV0V6WldOaVpUVmxaREV5WVdJMFpEaGxNVEZpWVRnM00yTXlaakV4TVRZeE1qQXlZamswTlNJc0ltUnZZM1J2Y2t4cFkyVnVjMlVpT21aaGJITmxmWDBzSW5OMVlpSTZleUprYVdRaU9pSmthV1E2WlhSb2NqcG5iMlZ5YkdrNk1IZ3lRMEl4TnpWQk9UY3lNRE13TmpRelFqaGtNbVl4TmpsRk16VXhaVE01TXpjd01tRTRPRFpoSWl3aVlXUmtjbVZ6Y3lJNklqQjRNa05DTVRjMVFUazNNakF6TURZME0wSTRaREptTVRZNVJUTTFNV1V6T1RNM01ESmhPRGcyWVNKOUxDSnBjM01pT2lKa2FXUTZaWFJvY2pwbmIyVnliR2s2TUhnelpUY3dNemt5T1dNMll6UXhZakF3Wm1KaE0wRkNNelUxUm1NMU9VVXpORUUzTVRRM01URkdJbjAuc1pyTWExck96YkRKRG1xQ3hFcDE1bEpvRjQwbURRZGZWODNQY1Nfbldoa1Npcy1HV0NabzFaaGpWLUtjRDlsbzFNdGp1dFJwdnRLUGlNQmYwYkpKTndBIiwiZXlKaGJHY2lPaUpGVXpJMU5rc3RVaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoyWXlJNmV5SkFZMjl1ZEdWNGRDSTZXeUpvZEhSd2N6b3ZMM2QzZHk1M015NXZjbWN2TWpBeE9DOWpjbVZrWlc1MGFXRnNjeTkyTVNKZExDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJbDBzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbHpjM1ZsY2lJNmV5SnVZVzFsSWpvaVRXVmthV05oYkNCU1pXTnZjbVFnVFdGdVlXZGxiV1Z1ZENCQmMzTnZZMmxoZEdsdmJpSXNJbUZrWkhKbGMzTWlPaUl3ZUROR1pUZEVRalEzTURjeU1EQmxZMFJsTjJRME56ZzRZamd3TldZeU1qVTJSVE5pUXpRNE5qY2lmU3dpYUc5emNHbDBZV3dpT2lMc2hKenNtcmpyczVIc201QWlMQ0p0WldScFkyRnNVbVZqYjNKa2N5STZXM3NpYUc5emNHbDBZV3dpT2lMc2hKenNtcmpyczVIc201QWlMQ0prYmlJNkl1MlpqZXV3bGV5Q3JDSXNJbVIySWpvaU1qQXlNeTh4TVM4eU5TSXNJbWhwSWpvaTdKV1VJaXdpY0dnaU9pTHJzTEh0bUlqcnM1RWlMQ0p0WlNJNkl1MlZyZXlEbmV5Z25DSXNJbUZzSWpvaTZyQ1I2ckNCNjZXWUlpd2laR2tpT2lMc2dxenJwNTBpTENKMGNpSTZJdXV6dGVxMXJPdTJpT3F3Z0NJc0ltRmpJam9pN0pXSTdZT0E2cm1kN0lxMTY0dUk2NHVrSW4wc2V5Sm9iM053YVhSaGJDSTZJdXlFbk95YXVPdXprZXlia0NJc0ltUnVJam9pNnJDVjY3Q1Y3SUtzSWl3aVpIWWlPaUl5TURJekx6RXhMekk0SWl3aWFHa2lPaUxzbFpRaUxDSndhQ0k2SXUyZHJPcTNnT3VDbk95NW1PdXprU0lzSW0xbElqb2k3Wld0N0lPZDdLQ2NJaXdpWVd3aU9pTHFzSkhxc0lIcnBaZ2lMQ0prYVNJNkl1eUNyT3VublNJc0luUnlJam9pNjdPMTZyV3M2N2FJNnJDQUlpd2lZV01pT2lMc2xZanRnNERxdVozc2lyWHJpNGpyaTZRaWZWMTlmU3dpYzNWaUlqcDdJbVJwWkNJNkltUnBaRHBsZEdoeU9tZHZaWEpzYVRvd2VESkRRakUzTlVFNU56SXdNekEyTkROQ09HUXlaakUyT1VVek5URmxNemt6TnpBeVlUZzRObUVpTENKaFpHUnlaWE56SWpvaU1IZ3lRMEl4TnpWQk9UY3lNRE13TmpRelFqaGtNbVl4TmpsRk16VXhaVE01TXpjd01tRTRPRFpoSW4wc0ltbHpjeUk2SW1ScFpEcGxkR2h5T21kdlpYSnNhVG93ZUVVM05UZGtOVGhoTlVVMk5tSTNNalZCTUdJME5UaENOVFkwUldSaVl6VXdSVGs1TWpBNU5Ea2lmUS4teWhiOEJublBSdGZLVGhSNmhya0VFWWRpNkVTY1VNMUtzTHZPVHczVnI0bWRUYjF3NFBhQzEzR2JmdnQxNy0tMUhtTVdCbTk2RWdPZTFTd1l2cUJqQUEiLCJleUpoYkdjaU9pSkZVekkxTmtzdFVpSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lsMHNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1semMzVmxjaUk2ZXlKdVlXMWxJam9pVFdWa2FXTmhiQ0JTWldOdmNtUWdUV0Z1WVdkbGJXVnVkQ0JCYzNOdlkybGhkR2x2YmlJc0ltRmtaSEpsYzNNaU9pSXdlRE5HWlRkRVFqUTNNRGN5TURCbFkwUmxOMlEwTnpnNFlqZ3dOV1l5TWpVMlJUTmlRelE0TmpjaWZTd2lhRzl6Y0dsMFlXd2lPaUxzbmJqc3NwenJzNUhzbTVBaUxDSnRaV1JwWTJGc1VtVmpiM0prY3lJNlczc2lhRzl6Y0dsMFlXd2lPaUxzbmJqc3NwenJzNUhzbTVBaUxDSmtiaUk2SXV5WXBPdXdsZXlDckNJc0ltUjJJam9pTWpBeU15OHhNUzh5TUNJc0ltaHBJam9pNnJDUTZyaXdJaXdpY0dnaU9pTHJqNFhxc0pBaUxDSnRaU0k2SXVxd2tPcTRzT3lWdlNJc0ltRnNJam9pN0plRzdKMk1JaXdpWkdraU9pTHNsNGJzbll3aUxDSjBjaUk2SXUyUGtPeW5pTzJabUNJc0ltRmpJam9pTS15ZHZDRHFzcjNxczd3ZzdadUVJT3VDdE95YmtDSjlYWDE5TENKemRXSWlPbnNpWkdsa0lqb2laR2xrT21WMGFISTZaMjlsY214cE9qQjRNa05DTVRjMVFUazNNakF6TURZME0wSTRaREptTVRZNVJUTTFNV1V6T1RNM01ESmhPRGcyWVNJc0ltRmtaSEpsYzNNaU9pSXdlREpEUWpFM05VRTVOekl3TXpBMk5ETkNPR1F5WmpFMk9VVXpOVEZsTXprek56QXlZVGc0Tm1FaWZTd2lhWE56SWpvaVpHbGtPbVYwYUhJNloyOWxjbXhwT2pCNFF6Qm1NV1UxTmpsbFEwWTNORFExUlRnME5UY3hOa0kxT0RRMVJrSkZPVUUwUmpBelJETm1OaUo5LlI3MDVpTlNLck40RjJfQ1puNkcyQ2tsakZ5ZXZGNldMOFFZTmlIMkZGbmM3aDR3SFdpOEVPb2N5OUpQUG9rWFNYQ2VCTnp5Tm4xeHB6RElPOFlSTFVBRSJdfSwiaXNzIjoiZGlkOmV0aHI6Z29lcmxpOjB4YTQ3RTNlQTYxYjI0MWFlZTJCYkEwYWEzOTBDOGI2QzEzRTZlMThFMCJ9.ACMv-RBHRsp5O0OTQc6Wh1Sqy1OOFjXGvjwQfgVOl9FlQ1cX3AU4RG_dwQKn9j1zYG0DrzvGfURkScng29WNRAE";
        setPatientJwt(temp);

        axios.post('https://api.dmrs.space:5003/link/generate', {
            payload: temp
        })
        .then(res => {
            setLink(res.data.link);
            
            axios.get(`${res.data.link}`)
            .then(res => {
                setVpJwt(res.data.payload);
                
                axios.post('https://api.dmrs.space:5001/user/record/vp', 
                {
                    vpJwt: res.data.payload,
                    did: did
                })
                .then(res => {
                    console.log("===== record/vp =====\n", res);    
                    setGetJwtDone(true);
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

    return(
        <div className='root'>
            <Header />
            <div className='body'>
                <h1>QR 스캔</h1>
                {/* <h2>기능 시현</h2>
                <button onClick={handleJwtInput}>동작</button>
                <p>QR로부터 받아온 링크 : {link}</p>
                <p>link로부터 받아온 vpJwt : {vpJwt}</p>
                {vpJwt==="" ? <></> : getJwtDone ? <button onClick={handleGetRecords}>진료기록 가져오기</button> : <p>이동 중...</p>}
                <hr style={{marginTop:'100px'}} /> */}
                <button onClick={handleGetRecords}>환자 진료기록 가져오기</button>
                <p>모바일로 환자의 QR코드를 스캔해주세요.</p>
                <hr />
                {/* <p>의사 모바일 테스트</p>
                <input type="text" value={patientJwt2} onChange={(e) => _setPatientJwt2(e.target.value)} />
                <button onClick={handleMobileTest}>jwt 입력</button>
                <p>{msg}</p>
                <hr /> */}
            </div>
            <Footer />
        </div>
    )
}

