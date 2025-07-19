import React, { useState, useRef } from 'react';

export default function StorefrontFileUpload({ label = "Upload 3D Model", onSuccess }) {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const allowedExtensions = ['.stl', '.obj', '.3mf', '.glb', '.gltf', '.ply', '.fbx'];

  const handleUpload = async (file) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError('Unsupported format');
      setSuccess('');
      return;
    }

    setFileName(file.name);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/storefront/upload-proxy', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const result = await res.json();

      const cleanFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_');
      const fileUrl = `/uploads/${cleanFileName}`;

      setSuccess(`✅ Uploaded: ${file.name}`);
      onSuccess?.(fileUrl); // 🔥 Notify parent component
    } catch (err) {
      console.error('Upload error:', err);
      setError('⚠️ Upload failed');
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '20px auto',
      padding: '30px',
      textAlign: 'center',
      border: '2px dashed #9c27b0',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
    }}>
      <h3>{label}</h3>
      <p>Drag & drop a 3D file or click to upload</p>

      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: '40px' }}>📤</div>
        <p>{fileName ? `Selected: ${fileName}` : 'Click or drop to upload'}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl,.obj,.3mf,.glb,.gltf,.ply,.fbx"
          onChange={handleBrowse}
          style={{ display: 'none' }}
        />
      </div>

      {error && <p style={{ color: '#d32f2f' }}>{error}</p>}
      {success && <p style={{ color: '#28a745' }}>{success}</p>}
    </div>
  );
}
