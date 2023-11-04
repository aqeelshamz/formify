"use client";
import { storeFiles } from "../../../utils/ipfsUpload";
import { useState } from "react";

export default function Test() {
  const [uploadedURL, setUploadedURL] = useState(null);

  const handleFileUpload = async (event) => {
    try {
      const files = event.target.files;
      if (files.length > 0) {
        const fileURL = await storeFiles(files);
        setUploadedURL(fileURL);
      } else {
        console.error("No files selected.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="m-5">
      <h1>IPFS</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      {uploadedURL && <p>Uploaded Files: <a href={uploadedURL} target="_blank" rel="noopener noreferrer">{uploadedURL}</a></p>}
    </div>
  );
}