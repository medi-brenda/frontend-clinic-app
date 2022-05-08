import React, { useRef } from "react";
import SignatureScreen from 'react-native-signature-canvas';

const SignaturePad = ({ onChange, style }) => {
    const ref = useRef();

    const handleSignature = (signature) => {
        onChange(signature);
    };

    const handleEnd = () => {
        ref.current.readSignature();
    }

    return (
        <SignatureScreen
            ref={ref}
            onEnd={handleEnd}
            onOK={handleSignature}
            webStyle={`.m-signature-pad--footer {display: none} .m-signature-pad--body {bottom: 20px; border: 0.5px solid #FF886D}`}
        />
    );
}

export default SignaturePad;