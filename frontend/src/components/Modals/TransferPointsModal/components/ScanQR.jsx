import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

export default function ScanQR({ handleQrScan, handleQrError, handleTab }) {
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
        Swal.fire({
          icon: "success",
          title: "QR Code Scanned",
          text: "QR Code scanned successfully",
        });
        handleTab(0);
      }
      //   (error) => {
      //     handleQrError(error);
      //   }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [handleQrScan, handleQrError, handleTab]);

  return <div id="reader" style={{ width: "100%" }}></div>;
}

ScanQR.propTypes = {
  handleQrScan: PropTypes.func.isRequired,
  handleQrError: PropTypes.func.isRequired,
  handleTab: PropTypes.func.isRequired,
};
