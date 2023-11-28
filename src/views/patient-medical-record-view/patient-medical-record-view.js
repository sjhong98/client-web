// import React, { useState, useEffect} from 'react';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';
import './patient-medical-record-view.css';
import { useSelector } from 'react-redux';

export default function PatientMedicalRecordView() {
    const patientInfo = useSelector(state => state.patientInfo);
    const data = useSelector(state => state.patientRecord);
    console.log(data);

    return(
        <div className='root'>
            <Header />
            <div className='body column-center'>

                <p style={{fontSize:'30px'}}>진료 기록</p>
                    <div className='input-container'>
                        <p className='input-title' style={{marginBottom:'3vh'}}>기본 정보</p>

                        <div className='input-field row'>
                            <div className='desc-container-1'>
                                <p className='desc'>환자명</p>
                            </div>
                            <p>{patientInfo.userInfo.name}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-1'>
                                <p className='desc'>진료 병원</p>
                            </div>
                            <p>{data.hospital}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-1'>
                                <p className='desc'>담당 의사명</p>
                            </div>
                            <p>{data.dn}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-1'>
                                <p className='desc'>진료일자</p>
                            </div>
                            <p>{data.dv}</p>
                        </div>

                        <hr />

                        <p className='input-title' style={{marginBottom:'3vh', marginTop:'5vh'}}>진료 정보</p>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>진행 이력</p>
                            </div>
                            <p>{data.hi}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>복용 약물</p>
                            </div>
                            <p>{data.me}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>알레르기 정보</p>
                            </div>
                            <p>{data.al}</p>
                        </div>

                        <hr />

                        <p className='input-title' style={{marginBottom:'3vh', marginTop:'5vh'}}>처방 내용</p>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>진단 결과</p>
                            </div>
                            <p>{data.di}</p>
                        </div>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>치료 방법 및 계획</p>
                            </div>
                            <p>{data.tr}</p>
                        </div>

                        <hr />

                        <p className='input-title' style={{marginBottom:'3vh', marginTop:'5vh'}}>추가 정보</p>

                        <div className='input-field row'>
                            <div className='desc-container-2'>
                                <p className='desc'>코멘트</p>
                            </div>
                            <p>{data.ac}</p>
                        </div>

                        
                </div>
                
            </div>
            <Footer />
        </div>
    )
}