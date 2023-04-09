import React, { useState } from "react";
import axios from "axios";
import config from "../../config";

interface UploadSheetMusicProps {
  onUploadSuccess: () => void;
}

function UploadSheetMusic({ onUploadSuccess }: UploadSheetMusicProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>("");

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("pdf", selectedFile);
        await axios.post(`${config.serverUrl}/uploadPdf/${pdfName}`, formData);
        onUploadSuccess();
        setPdfName("");
        setSelectedFile(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Add New Sheet Music</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="pdfName">PDF Name:</label>
          <input
            type="text"
            id="pdfName"
            value={pdfName}
            onChange={(event) => setPdfName(event.target.value)}
            required
          />
        </div>
        <div className="form-input">
          <label htmlFor="pdf">PDF:</label>
          <input type="file" id="pdf" onChange={handleFileInputChange} required />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadSheetMusic;
