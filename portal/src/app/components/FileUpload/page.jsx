

'use client';

import { useAppContext } from '@/app/Context';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const FileUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
const {API}=useAppContext();
  // Fetch list of uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(API+'/get-files');
        setUploadedFiles(response.data.files);
      } catch (error) {
        console.log("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [API]);

  // Handle file submission
  const submitImage = async (e) => {
    try {
      e.preventDefault();
      
      // FormData to send as multipart form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      
      console.log("Title: ", title);
      console.log("File: ", file);

      // Send POST request with file data
      const result = await axios.post(API+"/upload-files", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(result.data);
      // Refresh the list of uploaded files
      setUploadedFiles([...uploadedFiles, { title, pdf: file.name }]);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  // Handle file download
  const downloadFile = async (filename) => {
    try {
      const response = await axios({
        url: `http://localhost:4000/files/${filename}`,
        method: 'GET',
        responseType: 'blob', // Important for downloading files
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  return (
    <div>
      <h4>Upload PDF Files</h4>
      <form onSubmit={submitImage}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button 
          type="submit" 
          className="bg-black text-white py-2 px-4 rounded-xl"
        >
          Submit
        </button>
      </form>

      <h4>Uploaded Files</h4>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <strong>{file.title}</strong> - 
            <button 
              onClick={() => downloadFile(file.pdf)} 
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
