import PropTypes from "prop-types";
import { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function UploadQR({ handleQrError, handleQrScan, handleTab }) {
  const [file, setFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
      try {
        const html5QrCode = new Html5Qrcode("reader");
        const result = await html5QrCode.scanFile(file, true);
        handleQrScan(result);
      } catch (error) {
        handleQrError(error);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <div id="reader" style={{ width: "100%" }}></div>
      {file && (
        <button className="btn btn-primary mt-4 w-full" onClick={() => handleTab(0)}>
          Save
        </button>
      )}
    </div>
  );
}

UploadQR.propTypes = {
  handleQrError: PropTypes.func.isRequired,
  handleQrScan: PropTypes.func.isRequired,
  handleTab: PropTypes.func.isRequired,
};
