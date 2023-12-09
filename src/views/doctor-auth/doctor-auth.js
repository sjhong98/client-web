import React, { useState, useEffect} from 'react';
import axios from "axios"
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import './doctor-auth.css';

export default function DoctorAuth() {
    // isDoctor true이면서, Doctor 테이블에 없는 사람들 리스트 불러오기 - axios
    // doctorList에 형식맞춰 넣기
    // 체크박스 눌리면 axios로 눌린 정보 보내기
    // Doctor 테이블에 넣기
    // jwt 업데이트하고 해당 의사의 핸드폰으로 강제 업데이트 해준다는 컨셉 // 근데 이렇게 딥하게 할필요는 없음 // 테스트할때 편하라고 
    const [waitingList, setWaitingList] = useState([]);
    const serverIP = process.env.REACT_APP_SERVER_IP_ADDRESS;


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://${serverIP}:5001/user/get-doctor-waiting-list`);
                setWaitingList(response.data);
                console.log(waitingList)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    // eslint-disable-next-line
    }, []);

    return(
        <div className='root'>
            <Header />
                <div className='column-center auth-box'>
                <p style={{fontSize:'30px'}}>개발 정보</p>
                    <div className='records-box'>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <p>BackEnd --- </p>
                            <a href='https://github.com/viviviviviid'>viviviviviid</a>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <p>FrontEnd --- </p>
                            <a href='https://github.com/sjhong98'>sjhong98</a>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <a href='https://github.com/sjhong98/DMRS'>Github /</a>
                            <a href='https://noble-walker-465.notion.site/DMRS-5933966e79ef4b88a899260b1de5a8bf?pvs=4'>Notion</a>
                        </div>

                    </div>
                </div>
            <Footer />
        </div>
    )
}
