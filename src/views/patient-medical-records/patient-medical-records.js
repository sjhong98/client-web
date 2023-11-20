import React, { useState, useEffect} from 'react';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import {useNavigate} from 'react-router-dom';
import NewRecordButton from './newRecordButton.js';
import axios from 'axios';
import "./patient-medical-records.css";
import { useDispatch, useSelector } from 'react-redux';
import { setPatientRecord } from '../../redux/actions';

export default function PatientMedicalRecords() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(null);
    const [records, setRecords] = useState([]);
    const [isDiagnosis, setIsDiagnosis] = useState(false);
    const patientName = useSelector(state => state.patientName);
    const patientDid = useSelector(state => state.patientDid);
    const patientJwt = useSelector(state => state.patientJwt);
    const serverIP = process.env.REACT_APP_SERVER_IP_ADDRESS;

    useEffect(() => {
        localStorage.setItem('dmrs-jwt', 'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Imlzc3VlciI6eyJuYW1lIjoiTWVkaWNhbCBSZWNvcmQgTWFuYWdlbWVudCBBc3NvY2lhdGlvbiIsImFkZHJlc3MiOiIweDNGZTdEQjQ3MDcyMDBlY0RlN2Q0Nzg4YjgwNWYyMjU2RTNiQzQ4NjcifSwidXNlckluZm8iOnsibmFtZSI6IiIsImVtYWlsIjoiIiwiYmlydGhkYXkiOiIiLCJwaG9uZU51bWJlciI6IiIsImlzRG9jdG9yIjpmYWxzZSwiYWRkcmVzcyI6IjB4NjFkNDc4MzA2YWU1Rjk1NmI2RWJGNTQzMzUxRDU3ODQ5MzhEMjExRSJ9LCJtZWRpY2FsUmVjb3JkcyI6IjRmNTNjZGExOGMyYmFhMGMwMzU0YmI1ZjlhM2VjYmU1ZWQxMmFiNGQ4ZTExYmE4NzNjMmYxMTE2MTIwMmI5NDUiLCJkb2N0b3JMaWNlbnNlIjpmYWxzZX19LCJzdWIiOnsiZGlkIjoiZGlkOmV0aHI6Z29lcmxpOjB4NjFkNDc4MzA2YWU1Rjk1NmI2RWJGNTQzMzUxRDU3ODQ5MzhEMjExRSIsImFkZHJlc3MiOiIweDYxZDQ3ODMwNmFlNUY5NTZiNkViRjU0MzM1MUQ1Nzg0OTM4RDIxMUUifSwiaXNzIjoiZGlkOmV0aHI6Z29lcmxpOjB4RTk0QTM2RjBENDFjNDhGZDZkMjQyRGY2QzhEZDgyQzI1NzU4YkE4MSJ9.GNZ6AUQoSdBkblvmDSgVazLenlhDjfX3LhCG3ikpI14grsOe3-yYyjUkyaxHAKOVezwo7ZDhck61Znc2WdqblgE');
        if(patientJwt) setIsDiagnosis(true);
        else setIsDiagnosis(false);

        console.log(localStorage.getItem('did'));
    // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if(!isDiagnosis) {
            axios.post(`https://${serverIP}:5001/doctor/get-all-patient-records`, 
            {doctorJwt: localStorage.getItem("jwt"), patientDid: localStorage.getItem('did')}
            )
            .then((res) => {
                console.log(res);
                setRecords(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else {
            // jwt로 VC 받기
        }
        // eslint-disable-next-line
    }, [patientDid, serverIP]);

    const handleMouseOver = (index => {
        setActiveIndex(index);
    });

    const handleMouseOut = (() => {
        setActiveIndex(null);
    })


    return(
        <div className='root'>
            <Header />
            
            <div className='body column-center'>
                <div className='toolbar'>
                    {isDiagnosis ?
                        <NewRecordButton />
                        :
                        <></>
                    }
                </div>
                <p style={{fontSize:'30px'}}>{patientName}님의 진료 기록</p>
                <div className='records-box'>
                    <div className='records-index'>
                        <p className='records-index-date'>진료 내용</p>
                        <p className='records-index-hpt'>병원</p>
                        <p className='records-index-doctor'>담당의사</p>
                        <p className='records-index-notes'>진료일자</p>
                    </div>
                    { records.map((item, index) => {
                        return (
                            <div className={`records-list pointer ${activeIndex === index ? "records-mouseover" : ""}`} 
                                key={index}
                                onMouseOver={ () => {handleMouseOver(index)} }
                                onMouseOut={handleMouseOut} 
                                onClick={() => {
                                    navigate(`/patient-medical-record-view`);
                                    console.log(records[index]);
                                    dispatch(setPatientRecord(records[index]));
                                }}>
                                <div className='records-list-date'>
                                    <p>{item.diagnosis}</p>
                                </div>
                                <div className='records-list-hpt'>
                                    <p>{item.hospital}</p>
                                </div>
                                <div className='records-list-doctor'>
                                    <p>{item.doctorName}</p>
                                </div>
                                <div className='records-list-notes'>
                                    <p>{item.update_at}</p>
                                </div>
                            </div>
                        )
                    }) }

                </div>
            </div>
            <Footer />
        </div>
    )
}
