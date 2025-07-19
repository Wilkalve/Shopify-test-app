import { useState } from 'react';
import StorefrontFileUpload from './fileUpload';
import StorefrontViewer from './modelViewer';

export default function StorefrontUploadPage() {
  const [modelUrl, setModelUrl] = useState('');

  return (
    <div style={{ padding: '40px' }}>
      <h2>Upload Your 3D Model</h2>
      
      {/* Upload Form */}
      <StorefrontFileUpload
        onSuccess={(url) => {
          setModelUrl(url); 
        }}
      />

      {/* Model Viewer */}
      {modelUrl && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <StorefrontViewer modelUrl={modelUrl} />
        </>
      )}
    </div>
  );
}
