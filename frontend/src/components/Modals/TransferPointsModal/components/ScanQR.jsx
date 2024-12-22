import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import PropTypes from "prop-types";

export default function ScanQR({ handleQrScan, handleQrError }) {
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        handleQrScan(decodedText);
        html5QrcodeScanner.clear();
      },
    //   (error) => {
    //     handleQrError(error);
    //   }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [handleQrScan, handleQrError]);

  return <div id="reader" style={{ width: "100%" }}></div>;
}

ScanQR.propTypes = {
  handleQrScan: PropTypes.func.isRequired,
  handleQrError: PropTypes.func.isRequired,
};
