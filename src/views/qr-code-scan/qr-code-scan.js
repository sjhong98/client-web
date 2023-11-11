import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setPatientJwt, setPatientName } from '../../redux/actions.js';
import { useNavigate } from 'react-router-dom';

export default function QrCodeScan() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = io.connect('http://localhost:3001', {
        cors: { origin: '*' },
        reconnection: true, // 자동 재연결 활성화
        reconnectionAttempts: 10, // 최대 재연결 시도 횟수
        reconnectionDelay: 500, // 재연결 시도 간격
      });

    useEffect(() => {
        socket.emit('login', {email: "test", media: "web"});
        // eslint-disable-next-line
    }, [])

    socket.on('qr-stow', (data) => {
        console.log("from socket : ", data)
        dispatch(setPatientJwt(data.jwt));
        dispatch(setPatientName(data.name));
        navigate('/patient-medical-records');
    })

    return(
        <div className='root'>
            <Header />
            <div className='body'>
                <h1>QR 스캔</h1>
                <p>모바일로 환자의 QR코드를 스캔해주세요.</p>
            </div>
            <Footer />
        </div>
    )
}