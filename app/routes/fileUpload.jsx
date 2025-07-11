import React, { useState, useRef, useContext } from 'react';
import { Link } from '@remix-run/react';
import { ModelContext } from '../ModelContext'; // adjust path as needed

export default function FileUpload() {
  const { setFileData, setFileType } = useContext(ModelContext);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (file) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExtensions = ['.stl', '.obj', '.3mf', '.glb', '.gltf', '.ply', '.fbx'];

    if (!allowedExtensions.includes(ext)) {
      setError('Unsupported file type. Please upload a .stl, .obj, .3mf, .glb, .gltf, .ply, or .fbx file.');
      setFileName('');
      setIsUploaded(false);
      return;
    }

    setFileName(file.name);
    setError('');
    setIsUploaded(true);

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
      setFileType(ext);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const styles = {
    page: {
      fontFamily: 'Inter, Segoe UI, sans-serif',
      padding: '60px',
      maxWidth: '700px',
      margin: 'auto',
      textAlign: 'center',
      backgroundColor: '#f5f6fa',
      borderRadius: '12px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
    },
    subtext: {
      color: '#666',
      fontSize: '1.1rem',
      marginBottom: '20px',
    },
    dropZone: {
      padding: '40px',
      border: '2px dashed #9c27b0',
      borderRadius: '12px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    icon: {
      fontSize: '40px',
      marginBottom: '10px',
    },
    hiddenInput: {
      display: 'none',
    },
    success: {
      color: '#28a745',
      marginTop: '10px',
    },
    error: {
      color: '#d32f2f',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.page}>
      <h2>3D Model Upload</h2>
      <p style={styles.subtext}>
        Upload a 3D file or drop it here to preview your model.
      </p>

      <div
        style={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
        role="button"
        aria-label="Drop or click to upload"
      >
        <div style={styles.icon}>📤</div>
        <p>Drop your file here or click to browse</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleBrowse}
          style={styles.hiddenInput}
          accept=".stl,.obj,.3mf,.glb,.gltf,.ply,.fbx"
        />
      </div>

      {fileName && <p style={styles.success}>✅ Uploaded: {fileName}</p>}
      {error && <p style={styles.error}>⚠️ {error}</p>}

      {isUploaded && (
        <Link to="/modelViewer">
          <button
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#9c27b0',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
            aria-label="Preview uploaded 3D model"
          >
            Preview 3D Model
          </button>
        </Link>
      )}
    </div>
  );
}
