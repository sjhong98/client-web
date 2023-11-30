import axios from 'axios';
import React, { useState, useEffect} from 'react';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import {useNavigate} from 'react-router-dom';
import NewRecordButton from './newRecordButton.js';
import "./patient-medical-records.css";
import { useDispatch, useSelector } from 'react-redux';
import { setPatientRecord } from '../../redux/actions';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function PatientMedicalRecords() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(null);
    const [hospital, setHospital] = useState("전체");
    const patientInfo = useSelector(state => state.patientInfo);
    const patientVc = useSelector(state => state.patientVc);
    const isDiagnosis = useSelector(state => state.isDiagnosis);
    const patientDid = useSelector(state => state.patientDid);
    const [showVc, setShowVc] = useState([]);
    const doctorDid = localStorage.getItem("dmrs-did");
    const serverIP = process.env.REACT_APP_SERVER_IP_ADDRESS;

    useEffect(() => {
        localStorage.setItem('dmrs-jwt', 'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7Imlzc3VlciI6eyJuYW1lIjoiTWVkaWNhbCBSZWNvcmQgTWFuYWdlbWVudCBBc3NvY2lhdGlvbiIsImFkZHJlc3MiOiIweDNGZTdEQjQ3MDcyMDBlY0RlN2Q0Nzg4YjgwNWYyMjU2RTNiQzQ4NjcifSwidXNlckluZm8iOnsibmFtZSI6IiIsImVtYWlsIjoiIiwiYmlydGhkYXkiOiIiLCJwaG9uZU51bWJlciI6IiIsImlzRG9jdG9yIjpmYWxzZSwiYWRkcmVzcyI6IjB4NjFkNDc4MzA2YWU1Rjk1NmI2RWJGNTQzMzUxRDU3ODQ5MzhEMjExRSJ9LCJtZWRpY2FsUmVjb3JkcyI6IjRmNTNjZGExOGMyYmFhMGMwMzU0YmI1ZjlhM2VjYmU1ZWQxMmFiNGQ4ZTExYmE4NzNjMmYxMTE2MTIwMmI5NDUiLCJkb2N0b3JMaWNlbnNlIjpmYWxzZX19LCJzdWIiOnsiZGlkIjoiZGlkOmV0aHI6Z29lcmxpOjB4NjFkNDc4MzA2YWU1Rjk1NmI2RWJGNTQzMzUxRDU3ODQ5MzhEMjExRSIsImFkZHJlc3MiOiIweDYxZDQ3ODMwNmFlNUY5NTZiNkViRjU0MzM1MUQ1Nzg0OTM4RDIxMUUifSwiaXNzIjoiZGlkOmV0aHI6Z29lcmxpOjB4RTk0QTM2RjBENDFjNDhGZDZkMjQyRGY2QzhEZDgyQzI1NzU4YkE4MSJ9.GNZ6AUQoSdBkblvmDSgVazLenlhDjfX3LhCG3ikpI14grsOe3-yYyjUkyaxHAKOVezwo7ZDhck61Znc2WdqblgE');

        if(isDiagnosis) {
            let temp = [];
            for(let i=0; i<patientVc.length; i++) {
                let arr = patientVc[i].medicalRecords;
                for(let j=0; j<arr.length; j++) {
                    temp.push(arr[j]);
                }
            }
            setShowVc(temp);
        }
        else {
            let doc = JSON.parse(doctorDid);
            let pat = JSON.parse(patientDid);
            axios.post(`https://${serverIP}:5001/doctor/get-all-patient-records`, {
                doctorDID: doc,
                patientDID: pat
            })
            .then(res => {
                console.log('===== DB로부터 받아온 진료기록 =====\n', res.data);
                setShowVc(res.data);
            })
            .catch(err => {
                console.log("===== ERROR: get-all-patient-records \n", err);
            })

        }
        
    // eslint-disable-next-line
    }, [])


    const handleChangeVc = (e) => {
        let select = e.target.value;
        console.log(e.target.value);
        setHospital(e.target.value);
        setShowVc(patientVc[select].medicalRecords);
    }

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
                <div className='title-box'>
                    <p style={{fontSize:'30px'}}>{patientInfo.name}님의 진료 기록</p>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={hospital}
                        onChange={handleChangeVc}
                        sx={{width:150, height:40, marginLeft:5}}
                    >
                        { patientVc.map((item, index) => {
                            return (
                                <MenuItem value={index}>{item.hospital}</MenuItem>
                            )
                        })

                        }
                    </Select>
                </div>
                <div className='records-box'>
                    <div className='records-index'>
                        <p className='records-index-date'>진료 내용</p>
                        <p className='records-index-hpt'>병원</p>
                        <p className='records-index-doctor'>담당의사</p>
                        <p className='records-index-notes'>진료일자</p>
                    </div>
                    { showVc.map((item, index) => {
                        return (
                            <div className={`records-list pointer ${activeIndex === index ? "records-mouseover" : ""}`} 
                                key={index}
                                onMouseOver={ () => {handleMouseOver(index)} }
                                onMouseOut={handleMouseOut} 
                                onClick={() => {
                                    navigate(`/patient-medical-record-view`);
                                    dispatch(setPatientRecord(showVc[index]));
                                }}>
                                <div className='records-list-date'>
                                    <p>{item.di}</p>
                                </div>
                                <div className='records-list-hpt'>
                                    <p>{item.hospital}</p>
                                </div>
                                <div className='records-list-doctor'>
                                    <p>{item.dn}</p>
                                </div>
                                <div className='records-list-notes'>
                                    <p>{item.dv}</p>
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
