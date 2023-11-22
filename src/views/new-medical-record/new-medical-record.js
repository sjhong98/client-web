import axios from "axios";
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import React, { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import DatePicker from "react-datepicker";
import { useSelector } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function NewMedicalRecord() {
    const [hospital, setHospital] = useState("");
    const [doctor, setDoctor] = useState("");
    const [dateOfVisit, setDateOfVisit] = useState(new Date());
    const [date, setDate] = useState("");
    const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState("");
    const [pastMedicalHistory, setPastMedicalHistory] = useState("");
    const [medications, setMedications] = useState("");
    const [allergies, setAllergies] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");
    const [additionalComments, setAdditionalComments] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doctorDid, setDoctorDid] = useState("");
    // eslint-disable-next-line
    const [name, setName] = useState(useSelector(state => state.patientName));
    // eslint-disable-next-line
    const [patientJwt, setPatientJwt] = useState(useSelector(state => state.patientJwt));

    useEffect(() => {  
        setDoctorDid(localStorage.getItem("dmrs-did"));
    }, []);

    useEffect(() => {
        const temp = dateOfVisit.toString().split(" ");
        let month = temp[1];
        switch(month) {
            case "Jan": month="1"; break;
            case "Feb": month="2"; break;
            case "Mar": month="3"; break;
            case "Apr": month="4"; break;
            case "May": month="5"; break;
            case "Jun": month="6"; break;
            case "Jul": month="7"; break;
            case "Aug": month="8"; break;
            case "Sep": month="9"; break;
            case "Oct": month="10"; break;
            case "Nov": month="11"; break;
            case "Dec": month="12"; break;
            default : break;
        }
        let _date = temp[3]+"/"+month+"/"+temp[2];
        setDate(_date);
        _date = "";
    }, [dateOfVisit]);

    const handleClick = async () => {

        const serverIP = process.env.REACT_APP_SERVER_IP_ADDRESS;

        const medicalRecord = {
            hospital: hospital,
            dn: doctor,
            dv: date,
            hi: historyOfPresentIllness,
            ph: pastMedicalHistory,
            me: medications,
            al: allergies,
            di: diagnosis,
            tr: treatment,
            ac: additionalComments
        }

        await axios.post(`https://${serverIP}:5001/user/new-record`, {
                doctorDID: doctorDid,
                patientDID: patientJwt,
                medicalRecord,
            })
            .then(res => {
                setIsLoading(false);
                console.log(res);
                // localStorage.setItem("dmrs-jwt", res.data.updatedVcJwt);  // -> 환자 로컬에 저장되어야함.
                navigate(`/patient-medical-records?patient=${name}`);
            }).catch(err => console.log(err))
    }

    return (
        <div className='root'>
            <Header />
            {
                isLoading ?
                <div className='column-center auth-loading'>
                    <p>진료기록 작성 중</p>
                    <Box sx={{ width: '60%' }}> 
                        <LinearProgress />
                    </Box>
                </div>
                :
                <div className='body column-center'>
                <p style={{ fontSize: '30px' }}>진료기록 작성</p>
                <div className='input-container'>
                    <p className='input-title' 
                        style={{ marginBottom: '3vh' }}>기본 정보</p>
    
                    {/* 진료일자 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>진료일자</p>
                        </div>
                        <DatePicker 
                            className='date-picker'
                            dateFormat="yyyy/MM/dd"
                            selected={dateOfVisit} 
                            onChange={(date) => 
                                setDateOfVisit(date)}
                            />
                    </div>

                    {/* 환자명 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>환자명</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={name} 
                            onChange={(e) => 
                                setName(e.target.value)} 
                            />
                    </div>
    
                    {/* 진료 병원 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>진료 병원</p>
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={hospital}
                            sx={{marginLeft:5, width: 310, height: 23}}
                            onChange={(e) => {setHospital(e.target.value)}}
                        >
                            <MenuItem value={"서울병원"}>서울병원</MenuItem>
                            <MenuItem value={"인천병원"}>인천병원</MenuItem>
                            <MenuItem value={"경기병원"}>경기병원</MenuItem>
                            <MenuItem value={"충남병원"}>충남병원</MenuItem>
                            <MenuItem value={"부산병원"}>부산병원</MenuItem>
                        </Select>
                    </div>
    
                    {/* 담당 의사명 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>담당 의사명</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={doctor} 
                            onChange={(e) => 
                                setDoctor(e.target.value)} 
                            />
                    </div>
    
                    {/* 현재 병력사 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>현재 병력사</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={historyOfPresentIllness} 
                            onChange={(e) => 
                                setHistoryOfPresentIllness(e.target.value)} 
                            />
                    </div>
    
                    {/* 과거 병력사 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>과거 병력사</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={pastMedicalHistory} 
                            onChange={(e) => 
                                setPastMedicalHistory(e.target.value)} 
                            />
                    </div>
    
                    {/* 약물 처방 내역 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>약물 처방 내역</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={medications} 
                            onChange={(e) => 
                                setMedications(e.target.value)} 
                            />
                    </div>
    
                    {/* 알레르기 정보 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>알레르기 정보</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={allergies} 
                            onChange={(e) => 
                                setAllergies(e.target.value)} 
                            />
                    </div>
    
                    {/* 진단 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>진단</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={diagnosis} 
                            onChange={(e) => 
                                setDiagnosis(e.target.value)} 
                            />
                    </div>
    
                    {/* 치료 */}
                    <div className='input-field row'>
                        <div className='desc-container-1'>
                            <p className='desc'>치료</p>
                        </div>
                        <input 
                            className='input-1' 
                            value={treatment} 
                            onChange={(e) => 
                                setTreatment(e.target.value)} 
                            />
                    </div>
    
                    {/* 추가 코멘트 */}
                    <div className='input-field row'>
                        <div className='desc-container-2'>
                            <p className='desc'>추가 코멘트</p>
                        </div>
                        <textarea 
                            className='input-2' 
                            value={additionalComments} 
                            onChange={(e) => 
                                setAdditionalComments(e.target.value)} 
                            />
                    </div>

                    <div className='row-center'>
                        <button className='submit-button' 
                                onClick={handleClick}>
                            제출
                        </button>
                    </div>
                </div>
            </div>
            }
            <Footer />
        </div>
    );
}    
                    
