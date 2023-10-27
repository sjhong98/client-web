// import React, { useState, useEffect} from 'react';
import Header from '../../modules/header.js';
import Footer from '../../modules/footer.js';

export default function QrCodeScan() {
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