import React from 'react';

const QrCode = (qrCode) => {
    var showqr = false
    console.log("adadasd", qrCode)
    if (qrCode != null) {

        showqr = true
    }
    console.log("adadasd", showqr)

    return (
        <div>
            <p>check your email for verify email</p>





            {qrCode}


            <p>scan this qr code by google authenticatior app</p>
            <h5>if you done then verify your email</h5>
            <ul>
                <li><a href="/api/v1/email_verification/verify">verify email</a></li>
            </ul>
        </div>
    );
}

export default QrCode;
